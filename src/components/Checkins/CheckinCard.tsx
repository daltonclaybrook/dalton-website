import React, { FunctionComponent } from 'react';
import CheckinDetails from '../../models/CheckinDetails';

interface DetailsExpecting {
    details?: CheckinDetails;
}

const CheckinCard: FunctionComponent<DetailsExpecting> = ({ details }) => (
    <div>
        {details &&
            <h3>{details.name}</h3>
        }
    </div>
);

export default CheckinCard;
