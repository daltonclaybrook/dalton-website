import React, { SFC, useEffect, useState } from 'react';
import ICheckin from '../../models/ICheckin';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';

interface ICheckinsExpecting {
    checkins: ICheckin[];
}

const enhancer = (Component: SFC<ICheckinsExpecting>) => () => {
    const [checkins, loadCheckins] = useState<ICheckin[]>([]);
    useEffect(() => {
        fetchCheckins().then(loadCheckins);
    });
    return <Component checkins={checkins} />;
};

const View: SFC<ICheckinsExpecting> = ({ checkins }) => (
    <div className="checkins">
        <h2>Checkins</h2>
        {checkins.map((checkin) => <CheckinCard key={checkin.id} {...checkin} />)}
    </div>
);

export default enhancer(View);
