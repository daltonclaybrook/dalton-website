
import React, { SFC, useEffect, useState } from 'react';
import IBook from '../../models/IBook';
import { fetchBooks } from './api';
import Book from './Book';

interface IBookSExpecting {
    books: IBook[];
}

const enhancer = (Component: SFC<IBookSExpecting>) => () => {
  const [books, loadBooks] = useState<IBook[]>([]);
  useEffect(() => {
    fetchBooks().then(loadBooks);
  });
  return <Component books={books} />;
};

const View: SFC<IBookSExpecting> = ({ books }) => (
  <div className="books">
    <h2>Books</h2>
    {books.map((book) => <Book key={book.id} {...book} />)}
  </div>
);

export default enhancer(View);
