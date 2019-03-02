import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import CheckinDetails from '../../models/CheckinDetails';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import GoogleMap from './GoogleMap';

const maxWidth = 40;

const Box = styled.div`
    display: flex;
    height: 20rem;

    @media (max-width: ${maxWidth}rem) {
        flex-direction: column-reverse;
        height: auto;
    }
`;

const MapBox = styled.div`
    flex: 70%;

    @media (max-width: ${maxWidth}rem) {
        height: 20rem;
    }
`;

const CardBox = styled.div`
    flex: 30%;
    border: 1px solid darkgray;
`;

interface CheckinsBoxProps {
    checkins: Checkin[];
    selected: NewOldDetails;
    setNewDetails(details: CheckinDetails): void;
}

interface NewOldDetails {
    newDetails?: CheckinDetails;
    oldDetails?: CheckinDetails;
}

const Checkins: FunctionComponent = () => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [selected, setSelected] = useState<NewOldDetails>({});
    useEffect(() => {
        fetchCheckins().then(setCheckins);
    }, []);
    const setNewDetails = (newDetails: CheckinDetails) => setSelected({
        newDetails,
        oldDetails: selected.newDetails,
    });
    const props = { checkins, selected, setNewDetails };
    return <CheckinsBox {...props} />;
};

const CheckinsBox: FunctionComponent<CheckinsBoxProps> = ({ checkins, selected, setNewDetails }) => (
    <div>
        <Header>Recently spotted</Header>
        {checkins.length > 0 &&
            <Box>
                <CardBox>
                    <CheckinCard newDetails={selected.newDetails} oldDetails={selected.oldDetails} />
                </CardBox>
                <MapBox>
                    <GoogleMap checkins={checkins} setSelected={setNewDetails} />
                </MapBox>
            </Box>
        }
    </div>
);

export default Checkins;
