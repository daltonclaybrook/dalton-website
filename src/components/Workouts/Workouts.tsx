import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';
import { makeWorkoutViewModel } from '../../view-models/WorkoutViewModelFactory';
import Header from '../shared/Header';
import { fetchWorkouts } from './api';
import WorkoutCard from './WorkoutCard';

const maxWidth = 40;

interface WorkoutsExpecting {
    workouts: WorkoutViewModel[];
}

const Box = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /* reverse the margin from the last row */
    margin-bottom: -1rem;

    @media (max-width: ${maxWidth}rem) {
        flex-direction: column;
    }
`;

const StyledWorkout = styled(WorkoutCard)`
    width: calc(33% - 0.5em);
    margin-bottom: 1rem;
    border: 1px solid darkgray;

    @media (max-width: ${maxWidth}rem) {
        width: 100%;
    }
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
            {workouts.map((workout) => <StyledWorkout key={workout.id} {...workout} /> )}
        </Box>
    </>
);

export default enhancer(Workouts);
