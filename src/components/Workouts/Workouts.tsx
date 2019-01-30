import React, { FunctionComponent, useEffect, useState } from 'react';
import Workout from '../../models/Workout';
import Checkins from '../Checkins';
import { fetchWorkouts } from './api';
import WorkoutCard from './WorkoutCard';

interface WorkoutsExpecting {
    workouts: Workout[];
}

const enhancer = (Component: FunctionComponent<WorkoutsExpecting>) => () => {
    const [workouts, loadWorkouts] = useState<Workout[]>([]);
    useEffect(() => {
        fetchWorkouts().then(loadWorkouts);
    });
    return <Component workouts={workouts} />;
};

const Workouts: FunctionComponent<WorkoutsExpecting> = ({ workouts }) => (
    <div className="workouts">
        <h2>Workouts</h2>
        {workouts.map((workout) => <WorkoutCard key={workout.id} {...workout} /> )}
    </div>
);

export default enhancer(Workouts);
