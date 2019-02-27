package main

import (
	"encoding/xml"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
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

	activites, err := mainFetch()
	if err != nil {
		return response, err
	}

	response.StatusCode = 200
	response.Body = activites
	return response, nil
}

// called by lamda handler and used for testing
func mainFetch() (string, error) {
	apiKey := os.Getenv("GOODREADS_API_KEY")
	userID := os.Getenv("GOODREADS_USER_ID")
	if len(apiKey) == 0 || len(userID) == 0 {
		return "", missingEnvVariable
	}

	query := url.Values{}
	query.Add("v", "2")
	query.Add("key", apiKey)
	query.Add("id", userID)
	query.Add("shelf", "currently-reading")

	booksURL, err := url.Parse("https://www.goodreads.com/review/list.xml")
	if err != nil {
		return "", err
	}
	booksURL.RawQuery = query.Encode()

	req, err := http.NewRequest(http.MethodGet, booksURL.String(), nil)
	if err != nil {
		return "", err
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return "", requestFailed
	}

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	response := BooksResponse{}
	if err := xml.Unmarshal(bytes, &response); err != nil {
		return "", err
	}

	return response.Reviews.Reviews[0].Book.Title, nil
}

func debugFetch() {
	books, err := mainFetch()
	if err != nil {
		fmt.Printf("error: %v\n", err)
	} else {
		fmt.Printf("books: %v\n", books)
	}
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
	Book Book `xml:"book"`
}

// Book represents a book from goodreads
type Book struct {
	Title    string  `xml:"title"`
	ImageURL string  `xml:"image_url"`
	Link     string  `xml:"link"`
	Authors  Authors `xml:"authors"`
}

// Authors represents a list of authors of a book
type Authors struct {
	Authors []string `xml:"author"`
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
