import React, { Component } from 'react';
import IBook from '../models/IBook';

const Book = (book: IBook) => (
    <>
    <h3>{book.title}</h3>
    <h4>{book.authors.join(', ')}</h4>
    </>
);

export default Book;
