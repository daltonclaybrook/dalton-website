import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface HeaderProps {
    children: string;
}

const Header: FunctionComponent<HeaderProps> = ({ children }) => (
    <div className="header">
        <h2>{children}</h2>
        <hr />
    </div>
);

export default Header;
