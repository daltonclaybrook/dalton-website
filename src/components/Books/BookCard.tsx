import React, { SFC } from 'react';
import Book from '../../models/Book';

const BookCard: SFC<Book> = (book) => (
    <div className="book">
        <img src={book.imageURL}/>
        <a href={book.link}><h3>{book.title}</h3></a>
        <h4>{book.authors.join(', ')}</h4>
    </div>
);

export default BookCard;
