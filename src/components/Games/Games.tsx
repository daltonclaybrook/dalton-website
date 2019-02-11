import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Header from '../shared/Header';

const Game = styled.iframe`
    display: block;
    margin: auto;
    border-style: solid;
    border-width: thin;
`;

interface WidthExpecting {
    width: number;
}

const GamesMediaQuery = () => {
    const mediaQuery = window.matchMedia('(max-width: 700px)');
    const widthFromMQ = (mq: MediaQueryList|MediaQueryListEvent) => mq.matches ? 354 : 552;
    const [width, setWidth] = useState<number>(widthFromMQ(mediaQuery));
    mediaQuery.addListener((mq) => setWidth(widthFromMQ(mq)));
    return <Games width={width} />;
};

const Games: FunctionComponent<WidthExpecting> = ({ width }) => (
    <div className="games">
        <Header>Games</Header>
        <Game src="https://itch.io/embed/359750" width={width} height="167"></Game>
    </div>
);

export default GamesMediaQuery;
