import React, { FunctionComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const FadeOut = styled.div`
    position: absolute;
    top: 0;
    animation: ${fadeOut} 1s;
    opacity: 0;
`;

const FadeIn = styled.div`
    position: absolute;
    top: 0;
    animation-name: ${fadeIn};
    animation-duration: 2s;
    animation-delay: 1s;
    opacity: 1;
`;

const Card = styled.div`
    position: relative;
    padding: 0 1rem;
`;

const Sticker = styled.img`
    width: 3rem;
    height: 3rem;
`;

interface OldAndNewDetails {
    oldDetails?: CheckinDetails;
    newDetails?: CheckinDetails;
}

interface DetailsExpecting {
    details: CheckinDetails;
}

const CheckinCard: FunctionComponent<OldAndNewDetails> = ({ oldDetails, newDetails }) => (
    <Card>
        {oldDetails &&
            <FadeOut>
                <DetailsView details={oldDetails} />
            </FadeOut>
        }
        {newDetails &&
            <FadeIn>
                <DetailsView details={newDetails} />
            </FadeIn>
        }
    </Card>
);

const DetailsView: FunctionComponent<DetailsExpecting> = ({ details }) => {
    return (
        <>
            <a href={details.linkURL}><h3>{details.name}</h3></a>
            <p>{details.dateString}</p>
            {details.stickerImageURL &&
                <Sticker src={details.stickerImageURL} />
            }
            <p>{details.address}</p>
        </>
    );
};

export default CheckinCard;
