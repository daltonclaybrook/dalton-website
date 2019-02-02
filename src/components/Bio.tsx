import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
    border-radius: 50%;
`;

const Bio: FunctionComponent = () => (
    <div className="bio">
        <Avatar src="https://gravatar.com/avatar/409d9fd7356a2876a35dcd461713d749?s=400" />
        <h1>Dalton Claybrook</h1>
        <p>Thanks for checking out my site.</p>
    </div>
);

export default Bio;
