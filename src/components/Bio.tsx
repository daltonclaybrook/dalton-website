import marked from 'marked';
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
    border-radius: 50%;
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
        <Avatar src="https://gravatar.com/avatar/409d9fd7356a2876a35dcd461713d749?s=400" />
        <h1>Hi, I'm Dalton.</h1>
        <div id={BIOID} />
    </div>
);

export default enhancer(Bio);
