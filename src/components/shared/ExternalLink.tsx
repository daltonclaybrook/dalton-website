import React, { FC, HTMLProps } from 'react';

const ExternalLink: FC<HTMLProps<HTMLAnchorElement>> = ({ children, ...props }) => (
    <a rel="external" target="_blank" {...props}>{children}</a>
);

export default ExternalLink;
