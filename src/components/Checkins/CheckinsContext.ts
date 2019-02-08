import React, { FunctionComponent } from 'react';
import CheckinDetails from '../../models/CheckinDetails';

interface CheckinsContext {
    selected: CheckinDetails | null;
}

const context = React.createContext<CheckinsContext>({ selected: null });

export const CheckinsContextProvider = context.Provider;
export const CheckinsContextConsumer = context.Consumer;
