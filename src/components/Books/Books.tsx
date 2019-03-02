import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import BooksResponse from '../../models/BooksResponse';
import Header from '../shared/Header';
import { fetchBooks } from './api';
import BookCard from './BookCard';

const maxWidth = 40;

interface BooksExpecting {
    books: BooksResponse;
}

const Box = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: ${maxWidth}rem) {
        flex-direction: column;
    }
`;

const Section = styled.div`
    width: calc(50% - 1rem);

    @media (max-width: ${maxWidth}rem) {
        width: 100%;
    }
`;

const enhancer = (Component: FunctionComponent<BooksExpecting>) => () => {
    const [books, loadBooks] = useState<BooksResponse>({ reading: [], next: [] });
    useEffect(() => {
        fetchBooks().then(loadBooks);
    }, []); // pass an empty array to keep from calling `useEffect` recursively on state change.
    return <Component books={books} />;
};

const View: FunctionComponent<BooksExpecting> = ({ books }) => (
    <Box>
        <Section>
            <Header>Reading</Header>
            {books.reading.map((book) => <BookCard key={book.id} book={book} shrinkImage={false} />)}
        </Section>
        <Section>
            <Header>Want to read</Header>
            {books.next.map((book) => <BookCard key={book.id} book={book} shrinkImage={true} />)}
        </Section>
    </Box>
);

export default enhancer(View);
