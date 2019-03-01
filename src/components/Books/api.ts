import { fetchEndpoint } from '../../business/api';
import BooksResponse from '../../models/BooksResponse';

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/books/v2';

export const fetchBooks = async (): Promise<BooksResponse> =>
    fetchEndpoint(ENDPOINT, (response: BooksResponse) => response);
