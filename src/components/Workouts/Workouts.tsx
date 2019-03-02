import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';
import { makeWorkoutViewModel } from '../../view-models/WorkoutViewModelFactory';
import Header from '../shared/Header';
import { fetchWorkouts } from './api';
import WorkoutCard from './WorkoutCard';

interface WorkoutsExpecting {
    workouts: WorkoutViewModel[];
}

const Box = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledWorkout = styled.div`
    flex: 1;
    max-width: calc(33% - 0.5em);
    border: 1px solid darkgray;
`;

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
    <>
        <Header>Workouts</Header>
        <Box>
            {workouts.map((workout) => <StyledWorkout><WorkoutCard key={workout.id} {...workout} /></StyledWorkout> )}
        </Box>
    </>
);

export default enhancer(Workouts);
