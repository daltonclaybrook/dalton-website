import React, { FunctionComponent, useEffect, useState } from 'react';
import Checkin from '../../models/Checkin';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import Google from './Google';

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
    <div className="checkins">
        <Header>Last spotted</Header>
        {checkins.length > 0 &&
            <Google checkins={checkins} />
        }
    </div>
);

export default enhancer(View);
