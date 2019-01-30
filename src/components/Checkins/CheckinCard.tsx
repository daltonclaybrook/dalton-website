import React, { FunctionComponent } from 'react';
import Checkin from '../../models/Checkin';

const CheckinCard: FunctionComponent<Checkin> = (checkin) => (
    <div className="checkin">
        <h3>{checkin.venueName}</h3>
        {/* <h4>{checkin.createdAt.toDateString()}</h4> */}
    </div>
);

export default CheckinCard;
