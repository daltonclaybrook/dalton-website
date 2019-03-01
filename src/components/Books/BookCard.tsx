import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Book from '../../models/Book';

interface BookCardProps {
    book: Book;
    showImage: boolean;
}

const Box = styled.div`
    display: flex;
`;

const PaddedImg = styled.img`
    padding-right: 1rem;
`;

const NoMarginH3 = styled.h3`
    margin: 0;
`;

const BookCard: FunctionComponent<BookCardProps> = ({book, showImage}) => (
    <Box className="book">
        {showImage &&
            <PaddedImg src={book.imageURL}/>
        }
        <div>
            <a href={book.link}><NoMarginH3>{book.title}</NoMarginH3></a>
            <h4>{book.authors.join(', ')}</h4>
        </div>
    </Box>
);

export default BookCard;
