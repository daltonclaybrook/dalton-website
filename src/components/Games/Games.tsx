import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Game = styled.iframe`
    border-style: solid;
    border-width: thin;
`;

const Games: FunctionComponent = () => (
    <div className="games">
        <h2>Games</h2>
        <Game src="https://itch.io/embed/359750" width="552" height="167"></Game>
    </div>
);

export default Games;
