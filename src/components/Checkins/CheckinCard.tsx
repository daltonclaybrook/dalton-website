import React, { FunctionComponent } from 'react';
import { CheckinsContextConsumer } from './CheckinsContext';

const CheckinCard: FunctionComponent = () => (
    <CheckinsContextConsumer>
        {(context) => context.selected && (
            <h3>{context.selected.name}</h3>
        )}
    </CheckinsContextConsumer>
);

export default CheckinCard;
