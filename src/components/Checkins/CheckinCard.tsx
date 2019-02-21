import React, { FunctionComponent, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';

const transitionTime = 200;

const FadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const FadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

interface CardProps {
    isHidden: boolean;
}

const Card = styled.div<CardProps>`
    position: relative;
    padding: 0 1rem;
    animation: ${(p) => p.isHidden ? FadeOut : FadeIn} ${transitionTime}ms linear;
`;

const Sticker = styled.img`
    width: 3rem;
    height: 3rem;
`;

interface OldAndNewDetails {
    oldDetails?: CheckinDetails;
    newDetails?: CheckinDetails;
}

interface DetailsProps {
    details: CheckinDetails;
    isHidden: boolean;
}

enum FadeState {
    Initial,
    FadingOut,
    FadingIn,
}

interface CheckinCardState {
    currentDetails?: CheckinDetails;
    fadeState: FadeState;
}

const CheckinCard: FunctionComponent<OldAndNewDetails> = ({ oldDetails, newDetails }) => {
    const [state, setState] = useState<CheckinCardState>({
        currentDetails: newDetails,
        fadeState: FadeState.Initial, // start fading out so we transition to fading in
    });
    useEffect(() => {
        if (state.fadeState === FadeState.Initial) {
            setState({ ...state, fadeState: FadeState.FadingIn });
        } else if (state.fadeState === FadeState.FadingIn) {
            setState({ currentDetails: oldDetails, fadeState: FadeState.FadingOut });
            window.setTimeout(() => {
                setState({ currentDetails: newDetails, fadeState: FadeState.FadingIn });
            }, transitionTime);
        }
    }, [newDetails]);

    const isHidden = state.fadeState === FadeState.FadingOut;
    const details = state.currentDetails;
    console.log(`hidden: ${isHidden}, details: ${(details) ? details.name : 'none'}`);
    return (details) ? <DetailsView isHidden={isHidden} details={details} /> : null;
};

const DetailsView: FunctionComponent<DetailsProps> = ({ isHidden, details }) => (
    <Card isHidden={isHidden}>
        <a href={details.linkURL}><h3>{details.name}</h3></a>
        <p>{details.dateString}</p>
        {details.stickerImageURL &&
            <Sticker src={details.stickerImageURL} />
        }
        <p>{details.address}</p>
    </Card>
);

export default CheckinCard;
