package main

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
	Id       int     `xml:"id"`
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
	Id       int      `json:"id"`
	Title    string   `json:"title"`
	ImageURL string   `json:"imageURL"`
	Link     string   `json:"link"`
	Authors  []string `json:"authors"`
}
