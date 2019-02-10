import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';

const Card = styled.div`
    padding: 0 1rem;
`;

interface DetailsExpecting {
    details?: CheckinDetails;
}

const CheckinCard: FunctionComponent<DetailsExpecting> = ({ details }) => (
    <Card>
        {details &&
            <>
                <a href={details.linkURL}><h3>{details.name}</h3></a>
                <p>{details.address}</p>
            </>
        }
    </Card>
);

export default CheckinCard;
