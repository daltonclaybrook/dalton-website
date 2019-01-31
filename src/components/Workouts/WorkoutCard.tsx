import React, { FunctionComponent } from 'react';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';

const WorkoutCard: FunctionComponent<WorkoutViewModel> = (workout) => (
    <div className="workout">
        <a href={workout.link}><h3>{workout.name}</h3></a>
        <h4>{workout.startString}</h4>
        <h4>{workout.durationString}</h4>
    </div>
);

export default WorkoutCard;
