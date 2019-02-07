import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import Google from './Google';

const Box = styled.div`
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

const enhancer = (Component: FunctionComponent<CheckinsExpecting>) => () => {
    const [checkins, loadCheckins] = useState<Checkin[]>([]);
    useEffect(() => {
        fetchCheckins().then(loadCheckins);
    }, []); // pass an empty array to keep from calling `useEffect` recursively on state change.
    return <Component checkins={checkins} />;
};

const View: FunctionComponent<CheckinsExpecting> = ({ checkins }) => (
    <div>
        <Header>Recently spotted</Header>
        {checkins.length > 0 &&
            <Box>
                <CardBox>
                    <CheckinCard {...checkins[0]} />
                </CardBox>
                <MapBox>
                    <Google checkins={checkins} />
                </MapBox>
            </Box>
        }
    </div>
);

export default enhancer(View);
