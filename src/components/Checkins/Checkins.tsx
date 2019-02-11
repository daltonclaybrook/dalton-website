import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import CheckinDetails from '../../models/CheckinDetails';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import GoogleMap from './GoogleMap';

const Box = styled.div`
    display: flex;
    margin: auto;
    height: 20rem;
`;

const CardBox = styled.div`
    flex: 30%;
    border: solid 1px darkgray;
`;

const MapBox = styled.div`
    flex: 70%;
`;

interface CheckinsBoxProps {
    checkins: Checkin[];
    selected: CheckinDetails|undefined;
    setSelected(details: CheckinDetails): void;
}

const Checkins: FunctionComponent = () => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [selected, setSelected] = useState<CheckinDetails|undefined>(undefined);
    useEffect(() => {
        fetchCheckins().then(setCheckins);
    }, []);
    const props = { checkins, selected, setSelected };
    return <CheckinsBox {...props} />;
};

const CheckinsBox: FunctionComponent<CheckinsBoxProps> = ({ checkins, selected, setSelected }) => (
    <div>
        <Header>Recently spotted</Header>
        {checkins.length > 0 &&
            <Box>
                <CardBox>
                    <CheckinCard details={selected} />
                </CardBox>
                <MapBox>
                    <GoogleMap checkins={checkins} selected={setSelected} />
                </MapBox>
            </Box>
        }
    </div>
);

export default Checkins;
