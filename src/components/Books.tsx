import React, { Component } from 'react';
import IBook from '../models/IBook';
import Book from './Book';

interface IBooksResponse {
    data: IBook[];
}

interface IBooksState {
    books: IBook[];
}

class Books extends Component<any, IBooksState> {
    constructor(props: any) {
        super(props);
        this.state = {
            books: [],
        };
    }

    public componentDidMount() {
        this.fetchBooks();
    }

    public render() {
        return (
            <>
                <h2>Books</h2>
                {this.state.books.map((book) => <Book key={book.id} {...book}/>)}
            </>
        );
    }

    // MARK: - Helpers
    private fetchBooks() {
        fetch('https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/books')
            .then((response) => {
                if (!response.ok) { throw Error('not ok'); }
                return response.json();
            })
            .then((booksResponse: IBooksResponse) => booksResponse.data)
            .then((books) => this.setState({ books }));
    }
}

export default Books;
