import Book from '../../models/Book';

interface BooksResponse {
  data: Book[];
}

enum ErrorReason {
  NotOK = 'not ok',
}

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/books';

const isError = (response: Response) => !response.ok;

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(ENDPOINT);
  if (isError(response)) {
    throw new Error(ErrorReason.NotOK);
  }
  const json = await response.json() as BooksResponse;
  return json.data;
};
