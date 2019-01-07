import React, { SFC } from 'react';
import ICheckin from '../../models/ICheckin';

const CheckinCard: SFC<ICheckin> = (checkin) => (
    <div className="checkin">
        <h3>{checkin.venueName}</h3>
        {/* <h4>{checkin.createdAt.toDateString()}</h4> */}
    </div>
);

export default CheckinCard;
