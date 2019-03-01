import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Book from '../../models/Book';

interface BookCardProps {
    book: Book;
    shrinkImage: boolean;
}

const Box = styled.div`
    display: flex;
`;

interface ImgProps {
    shrink: boolean;
}

const PaddedImg = styled.img<ImgProps>`
    padding-right: 1rem;
    padding-bottom: 1rem;
    ${(p) => p.shrink ? 'width: 3rem;' : ''}
    height: auto;
`;

const Title = styled.h3`
    margin: 0;
`;

const Author = styled.h4`
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
`;

const BookCard: FunctionComponent<BookCardProps> = ({book, shrinkImage}) => (
    <Box className="book">
        <div>
            <a href={book.link}>
                <PaddedImg shrink={shrinkImage} src={book.imageURL}/>
            </a>
        </div>
        <div>
            <a href={book.link}><Title>{book.title}</Title></a>
            <Author>{book.authors.join(', ')}</Author>
        </div>
    </Box>
);

export default BookCard;
