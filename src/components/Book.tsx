import React from 'react';
import IBook from '../models/IBook';

const Book = (book: IBook) => (
    <div className="book">
        <img src={book.imageURL}/>
        <a href={book.link}><h3>{book.title}</h3></a>
        <h4>{book.authors.join(', ')}</h4>
    </div>
);

export default Book;
