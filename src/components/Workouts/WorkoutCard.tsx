import React, { FunctionComponent } from 'react';
import Workout from '../../models/Workout';

const WorkoutCard: FunctionComponent<Workout> = (workout) => (
    <div className="workout">
        <h3>{workout.name}</h3>
    </div>
);

export default WorkoutCard;
