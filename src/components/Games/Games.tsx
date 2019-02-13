import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Constants from '../../shared/Constants';
import Header from '../shared/Header';

const Game = styled.iframe`
    width: 100%;
    margin-bottom: 1rem;
    border-style: none;
    border-width: 0;
`;

interface GameProps {
    width: number;
    urls: string[];
}

const Games = ({ width, urls }: GameProps): FunctionComponent => () => (
    <div className="games">
        <Header>Games</Header>
        {urls.map((url) => <Game src={url} width={width} />)}
    </div>
);

const gameURLs = [
    'https://itch.io/embed/359750',
    // soon...
];

export default Games({ width: Constants.contentMaxWidth, urls: gameURLs });
