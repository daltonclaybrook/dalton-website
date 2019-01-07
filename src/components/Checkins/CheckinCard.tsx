import React, { SFC } from 'react';
import Checkin from '../../models/Checkin';

const CheckinCard: SFC<Checkin> = (checkin) => (
    <div className="checkin">
        <h3>{checkin.venueName}</h3>
        {/* <h4>{checkin.createdAt.toDateString()}</h4> */}
    </div>
);

export default CheckinCard;
