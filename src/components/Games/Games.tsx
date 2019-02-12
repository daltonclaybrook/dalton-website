import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Header from '../shared/Header';

const Game = styled.iframe`
    display: block;
    margin: auto;
    border-style: solid;
    border-width: thin;
`;

type MatchBlock<U> = (matches: boolean) => U;

interface MediaQueryExpecting<T> {
    match: T;
}

const MediaQueryComponent = <T, U extends MediaQueryExpecting<T>>(Component: FunctionComponent<U>, query: string, matches: MatchBlock<T>) => (props: Exclude<U, MediaQueryExpecting<T>>) => {
    const mediaQuery = window.matchMedia(query);
    const matchValueFromMQ = (mq: MediaQueryList|MediaQueryListEvent) => matches(mq.matches);
    const [matchValue, setMatchValue] = useState<T>(matchValueFromMQ(mediaQuery));
    mediaQuery.addListener((mq) => setMatchValue(matchValueFromMQ(mq)));
    return <Component match={matchValue} {...props} />;
};

const Games: FunctionComponent<MediaQueryExpecting<number>> = ({ match }) => (
    <div className="games">
        <Header>Games</Header>
        <Game src="https://itch.io/embed/359750" width={match} height="167"></Game>
    </div>
);

export default MediaQueryComponent(Games, '(max-width: 700px)', (m) => m ? 354 : 552);
