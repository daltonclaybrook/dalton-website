import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import { CheckinsContextProvider } from './CheckinsContext';
import Google from './Google';

const StyledProvider = styled(CheckinsContextProvider)`
    display: flex;
    margin: auto;
    height: 20rem;
`;

const CardBox = styled.div`
    flex: 30%;
    padding: 0 1rem;
    border: solid 1px darkgray;
`;

const MapBox = styled.div`
    flex: 70%;
`;

interface CheckinsExpecting {
    checkins: Checkin[];
}

const fetchCheckinsEnhancer = (Component: FunctionComponent<CheckinsExpecting>) => () => {
    const [checkins, loadCheckins] = useState<Checkin[]>([]);
    useEffect(() => {
        fetchCheckins().then(loadCheckins);
    }, []); // pass an empty array to keep from calling `useEffect` recursively on state change.
    return <Component checkins={checkins} />;
};

const CheckinsSection: FunctionComponent<CheckinsExpecting> = ({ checkins }: CheckinsExpecting) => (
    <div>
        <Header>Recently spotted</Header>
        {checkins.length > 0 &&
            <CardAndMapView checkins={checkins} />
        }
    </div>
);

const CardAndMapView: FunctionComponent<CheckinsExpecting> = ({ checkins }) => (
    <StyledProvider value={{ selected: null }}>
        <CardBox>
            <CheckinCard />
        </CardBox>
        <MapBox>
            <Google checkins={checkins} />
        </MapBox>
    </StyledProvider>
);

export default fetchCheckinsEnhancer(CheckinsSection);
