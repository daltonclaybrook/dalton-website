import React, { FunctionComponent, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';
import Fader from '../shared/Animation';

const FadeOutAndIn = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
`;

const DetailAnimation = styled.div`
    animation: ${FadeOutAndIn} 2s linear;
`;

const Card = styled.div`
    padding: 0 1rem;
`;

const Sticker = styled.img`
    width: 3rem;
    height: 3rem;
`;

interface DetailsExpecting {
    oldDetails?: CheckinDetails;
    newDetails: CheckinDetails;
}

const CheckinCard: FunctionComponent<Partial<DetailsExpecting>> = ({ oldDetails, newDetails }) => (
    <Card>
        {newDetails &&
            <DetailsView newDetails={newDetails} />
        }
    </Card>
);

class CheckinFader extends Fader<CheckinDetails> {}

const DetailsView: FunctionComponent<DetailsExpecting> = ({ oldDetails, newDetails }) => {
    const [details, setDetails] = useState<CheckinDetails>(newDetails);
    return (
        <CheckinFader new={newDetails} old={oldDetails} setCurrent={setDetails}>
            <a href={details.linkURL}><h3>{details.name}</h3></a>
            <p>{details.dateString}</p>
            {details.stickerImageURL &&
                <Sticker src={details.stickerImageURL} />
            }
            <p>{details.address}</p>
        </CheckinFader>
    );
};

export default CheckinCard;
