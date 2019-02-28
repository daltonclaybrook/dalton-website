package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"regexp"
)

// main function
func main() {
	if len(os.Args) >= 2 && os.Args[1] == "test" {
		fmt.Println("debug fetching...")
		debugFetch()
	} else {
		fmt.Println("setting up lambda...")
		lambda.Start(HandleRequest)
	}
}

// HandleRequest from lambda
func HandleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	response := events.APIGatewayProxyResponse{
		Headers: map[string]string{"Access-Control-Allow-Origin": "*"},
	}

	books, err := mainFetch()
	if err != nil {
		return response, err
	}

	response.StatusCode = 200
	response.Body = books
	return response, nil
}

func mainFetch() (string, error) {
	xmlBooks, err := fetchBooks("currently-reading")
	if err != nil {
		return "", err
	}

	jsonBooks := makeJSONBooks(xmlBooks)
	jsonBytes, err := json.Marshal(jsonBooks)
	return string(jsonBytes), err
}

// called by lamda handler and used for testing
func fetchBooks(shelf string) ([]XMLBook, error) {
	books := []XMLBook{}

	apiKey := os.Getenv("GOODREADS_API_KEY")
	userID := os.Getenv("GOODREADS_USER_ID")
	if len(apiKey) == 0 || len(userID) == 0 {
		return books, missingEnvVariable
	}

	query := url.Values{}
	query.Add("v", "2")
	query.Add("key", apiKey)
	query.Add("id", userID)
	query.Add("shelf", shelf)

	booksURL, err := url.Parse("https://www.goodreads.com/review/list.xml")
	if err != nil {
		return books, err
	}
	booksURL.RawQuery = query.Encode()

	req, err := http.NewRequest(http.MethodGet, booksURL.String(), nil)
	if err != nil {
		return books, err
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return books, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return books, requestFailed
	}

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return books, err
	}

	response := BooksResponse{}
	if err := xml.Unmarshal(bytes, &response); err != nil {
		return books, err
	}

	books = make([]XMLBook, len(response.Reviews.Reviews))
	for idx, review := range response.Reviews.Reviews {
		books[idx] = review.Book
	}
	return books, nil
}

func debugFetch() {
	books, err := mainFetch()
	if err != nil {
		fmt.Printf("error: %v\n", err)
	} else {
		fmt.Printf("books: %v\n", books)
	}
}

func makeJSONBooks(xmlBooks []XMLBook) []JSONBook {
	jsonBooks := make([]JSONBook, len(xmlBooks))
	for idx, book := range xmlBooks {
		jsonBooks[idx] = book.makeJSON()
	}
	return jsonBooks
}

func (xmlBook XMLBook) makeJSON() (book JSONBook) {
	book.Title = xmlBook.Title
	book.ImageURL = xmlBook.ImageURL
	book.Link = xmlBook.Link

	authors := make([]string, len(xmlBook.Authors.Authors))
	regex := regexp.MustCompile(` +`)
	for idx, author := range xmlBook.Authors.Authors {
		// remove unnecessary whitespace
		authors[idx] = regex.ReplaceAllString(author.Name, " ")
	}
	book.Authors = authors
	return
}

// BooksResponseWrapper is the wrapper for BooksResponse
type BooksResponseWrapper struct {
	Response BooksResponse `xml:"GoodreadsResponse"`
}

// BooksResponse is the response fields
type BooksResponse struct {
	Reviews BookReviews `xml:"reviews"`
}

// BookReviews is the reviews wrapper
type BookReviews struct {
	Reviews []BookReview `xml:"review"`
}

// BookReview is the review, which contains the book
type BookReview struct {
	Book XMLBook `xml:"book"`
}

// XMLBook represents a book from the goodreads xml response
type XMLBook struct {
	Title    string  `xml:"title"`
	ImageURL string  `xml:"image_url"`
	Link     string  `xml:"link"`
	Authors  Authors `xml:"authors"`
}

// Authors represents a list of authors of a book
type Authors struct {
	Authors []Author `xml:"author"`
}

// Author represents an author of the book
type Author struct {
	Name string `xml:"name"`
}

// JSONBook is the json representation of a goodreads book
type JSONBook struct {
	Title    string   `json:"title"`
	ImageURL string   `json:"imageURL"`
	Link     string   `json:"link"`
	Authors  []string `json:"authors"`
}

// FetchError represents an error encountered by the app
type FetchError int

const (
	missingEnvVariable FetchError = iota
	requestFailed
)

func (err FetchError) Error() string {
	switch err {
	case missingEnvVariable:
		return "Missing environment variables. GOODREADS_API_KEY and GOODREADS_USER_ID must be set."
	case requestFailed:
		return "Failed to fetch books from goodreads."
	default:
		return "An unknown error occurred."
	}
}
