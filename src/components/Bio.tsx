import marked from 'marked';
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Links from './Links';

const Avatar = styled.img`
    display: block;
    margin: auto;
    border-radius: 50%;
`;

const Heading = styled.h1`
    text-align: center;
`;

const ENDPOINT = `${process.env.PUBLIC_URL}/bio.md`;
const BIOID = 'biomd';

const fetchBio = () => {
    fetch(ENDPOINT)
        .then((response) => response.text())
        .then(marked)
        .then((html) => {
            const element = document.getElementById(BIOID);
            if (element) {
                element.innerHTML = html;
            }
        });
};

const enhancer = (Component: FunctionComponent) => () => {
    useEffect(fetchBio, []);
    return <Component />;
};

const Bio: FunctionComponent = () => (
    <div className="bio">
        <Avatar src="https://gravatar.com/avatar/409d9fd7356a2876a35dcd461713d749?s=350" />
        <Heading>Hi, I'm Dalton.</Heading>
        <Links />
        <div id={BIOID} />
    </div>
);

export default enhancer(Bio);
