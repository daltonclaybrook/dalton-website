import React, { SFC, useEffect, useState } from 'react';
import IBook from '../../models/IBook';
import { fetchBooks } from './api';
import View from './BooksView';

interface IBooksState {
    books: IBook[];
}

const Books: SFC = () => {
  const [books, loadBooks] = useState<IBook[]>([]);
  useEffect(() => {
    fetchBooks().then(loadBooks);
  });
  return <View books={books} />;
};

export default Books;
