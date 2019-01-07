import React, { SFC } from 'react';
import IBook from '../../models/IBook';
import Book from './Book';

interface IProps {
    books: IBook[];
}

const BooksView: SFC<IProps> = ({ books }) => (
  <div className="books">
    <h2>Books</h2>
    {books.map((book) => <Book key={book.id} {...book} />)}
  </div>
);

export default BooksView;
