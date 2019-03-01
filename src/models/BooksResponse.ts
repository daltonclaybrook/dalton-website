import Book from './Book';

interface BooksResponse {
    reading: Book[];
    next: Book[];
}

export default BooksResponse;
