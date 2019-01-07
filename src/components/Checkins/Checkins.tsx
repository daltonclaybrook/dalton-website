import React, { SFC, useEffect, useState } from 'react';
import Checkin from '../../models/Checkin';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';

interface CheckinsExpecting {
    checkins: Checkin[];
}

const enhancer = (Component: SFC<CheckinsExpecting>) => () => {
    const [checkins, loadCheckins] = useState<Checkin[]>([]);
    useEffect(() => {
        fetchCheckins().then(loadCheckins);
    });
    return <Component checkins={checkins} />;
};

const View: SFC<CheckinsExpecting> = ({ checkins }) => (
    <div className="checkins">
        <h2>Checkins</h2>
        {checkins.map((checkin) => <CheckinCard key={checkin.id} {...checkin} />)}
    </div>
);

export default enhancer(View);
