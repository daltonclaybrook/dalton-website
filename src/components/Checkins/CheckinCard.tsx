import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';

const Card = styled.div`
    padding: 0 1rem;
`;

const Sticker = styled.img`
    width: 3rem;
    height: 3rem;
`;

interface DetailsExpecting {
    details: CheckinDetails;
}

const CheckinCard: FunctionComponent<Partial<DetailsExpecting>> = ({ details }) => (
    <Card>
        {details &&
            <DetailsView details={details} />
        }
    </Card>
);

const DetailsView: FunctionComponent<DetailsExpecting> = ({ details }) => (
    <div>
        <a href={details.linkURL}><h3>{details.name}</h3></a>
        <p>{details.dateString}</p>
        {details.stickerImageURL &&
            <Sticker src={details.stickerImageURL} />
        }
        <p>{details.address}</p>
    </div>
);

export default CheckinCard;
