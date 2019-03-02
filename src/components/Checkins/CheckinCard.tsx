import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckinDetails from '../../models/CheckinDetails';
import ExternalLink from '../shared/ExternalLink';

const transitionTime = 200;

interface CardProps {
    isHidden: boolean;
}

const Card = styled.div<CardProps>`
    position: relative;
    padding: 0 1rem;
    opacity: ${(p) => p.isHidden ? 0 : 1};
    transition: opacity ${transitionTime}ms;
    -webkit-transition: opacity ${transitionTime}ms; /* Safari */
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
    return (details) ? <DetailsView isHidden={isHidden} details={details} /> : null;
};

const DetailsView: FunctionComponent<DetailsProps> = ({ isHidden, details }) => (
    <Card isHidden={isHidden}>
        <ExternalLink href={details.linkURL}><h3>{details.name}</h3></ExternalLink>
        <p>{details.dateString}</p>
        {details.stickerImageURL &&
            <Sticker src={details.stickerImageURL} />
        }
        <p>{details.address}</p>
    </Card>
);

export default CheckinCard;
