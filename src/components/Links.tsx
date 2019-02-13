import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import github from '../icons/github.svg';
import instagram from '../icons/instagram.svg';
import linkedin from '../icons/linkedin.svg';
import stackoverflow from '../icons/stack-overflow.svg';
import twitter from '../icons/twitter.svg';

const LinksDiv = styled.div`
    text-align: center;
`;

const LinksBlock = styled.div`
    display: inline-block;
`;

const SpacedLink = styled.a`
    margin: 0rem 0.875rem;

    @media (max-width: 30rem) {
        margin: 0rem 0.275rem;
    }
`;

interface LinkProps {
    link: string;
    img: string;
    alt: string;
}

const ImgLink: FunctionComponent<LinkProps> = ({ link, img }) => (
    <SpacedLink href={link}><img src={img} /></SpacedLink>
);

const Links: FunctionComponent = () => (
    <LinksDiv className="links">
        <LinksBlock>
            <ImgLink link="https://github.com/daltonclaybrook" img={github} alt="github"/>
            <ImgLink link="https://twitter.com/daltonclaybrook" img={twitter} alt="twitter" />
            <ImgLink link="https://www.linkedin.com/in/dalton-claybrook-b7409629/" img={linkedin} alt="linked in" />
            <ImgLink link="https://www.instagram.com/daltonclaybrook/" img={instagram} alt="instagram" />
            <ImgLink link="http://stackoverflow.com/users/907186/daltonclaybrook" img={stackoverflow} alt="stack overflow" />
        </LinksBlock>
    </LinksDiv>
);

export default Links;
