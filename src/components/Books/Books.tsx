
import React, { SFC, useEffect, useState } from 'react';
import Book from '../../models/Book';
import { fetchBooks } from './api';
import BookCard from './BookCard';

interface BooksExpecting {
    books: Book[];
}

const enhancer = (Component: SFC<BooksExpecting>) => () => {
  const [books, loadBooks] = useState<Book[]>([]);
  useEffect(() => {
    fetchBooks().then(loadBooks);
  });
  return <Component books={books} />;
};

const View: SFC<BooksExpecting> = ({ books }) => (
  <div className="books">
    <h2>Books</h2>
    {books.map((book) => <BookCard key={book.id} {...book} />)}
  </div>
);

export default enhancer(View);
