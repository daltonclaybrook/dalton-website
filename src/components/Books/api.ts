import { fetchEndpoint } from '../../business/api';
import Book from '../../models/Book';

interface BooksResponse {
    data: Book[];
}

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/books';

export const fetchBooks = async (): Promise<Book[]> =>
    fetchEndpoint(ENDPOINT, (response: BooksResponse) => response.data);
