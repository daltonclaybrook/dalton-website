import React, { FunctionComponent, useEffect, useState } from 'react';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';
import { makeWorkoutViewModel } from '../../view-models/WorkoutViewModelFactory';
import { fetchWorkouts } from './api';
import WorkoutCard from './WorkoutCard';

interface WorkoutsExpecting {
    workouts: WorkoutViewModel[];
}

const enhancer = (Component: FunctionComponent<WorkoutsExpecting>) => () => {
    const [workouts, loadWorkouts] = useState<WorkoutViewModel[]>([]);
    useEffect(() => {
        fetchWorkouts()
            .then((w) => w.map(makeWorkoutViewModel))
            .then(loadWorkouts);
    }, []); // pass an empty array to keep from calling `useEffect` recursively on state change.
    return <Component workouts={workouts} />;
};

const Workouts: FunctionComponent<WorkoutsExpecting> = ({ workouts }) => (
    <div className="workouts">
        <h2>Workouts</h2>
        {workouts.map((workout) => <WorkoutCard key={workout.id} {...workout} /> )}
    </div>
);

export default enhancer(Workouts);
