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
	c1 := make(chan FetchResult)
	c2 := make(chan FetchResult)
	go asyncFetchBooks("currently-reading", c1)
	go asyncFetchBooks("reading-next", c2)

	result1, result2 := <-c1, <-c2
	if result1.err != nil {
		return "", result1.err
	} else if result2.err != nil {
		return "", result2.err
	}

	combined := map[string][]JSONBook{
		"reading": result1.books,
		"next":    result2.books,
	}

	jsonBytes, err := json.Marshal(combined)
	return string(jsonBytes), err
}

func debugFetch() {
	books, err := mainFetch()
	if err != nil {
		fmt.Printf("error: %v\n", err)
	} else {
		fmt.Println(books)
	}
}

// intended to be called in a goroutine
func asyncFetchBooks(shelf string, c chan FetchResult) {
	books, err := fetchBooks(shelf)
	c <- FetchResult{books: books, err: err}
}

// called by lamda handler and used for testing
func fetchBooks(shelf string) ([]JSONBook, error) {
	books := []JSONBook{}

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

	books = make([]JSONBook, len(response.Reviews.Reviews))
	for idx, review := range response.Reviews.Reviews {
		books[idx] = review.Book.makeJSON()
	}
	return books, nil
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

// FetchResult is the result of a fetch
type FetchResult struct {
	books []JSONBook
	err   error
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
