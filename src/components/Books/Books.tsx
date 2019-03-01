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

    @media (max-width: ${maxWidth}rem) {
        flex-direction: column;
    }
`;

const ReadingSection = styled.div`
    flex: 50%;
    padding-right: 1rem;

    @media (max-width: ${maxWidth}rem) {
        padding-right: 0;
    }
`;

const NextSection = styled.div`
    flex: 50%;
    padding-left: 1rem;

    @media (max-width: ${maxWidth}rem) {
        padding-left: 0;
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
        <ReadingSection>
            <Header>Reading</Header>
            {books.reading.map((book) => <BookCard key={book.id} book={book} shrinkImage={false} />)}
        </ReadingSection>
        <NextSection>
            <Header>Next</Header>
            {books.next.map((book) => <BookCard key={book.id} book={book} shrinkImage={true} />)}
        </NextSection>
    </Box>
);

export default enhancer(View);
