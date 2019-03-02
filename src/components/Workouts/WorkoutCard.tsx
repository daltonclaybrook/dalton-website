import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';

const Image = styled.img`
    max-width: 100%;
`;

const TextArea = styled.div`
    padding: 0 1rem;
`;

const Title = styled.h3`
    margin: 1rem 0;
`;

const Subtitle = styled.h4`
    margin: 1rem 0;
`;

const WorkoutCard: FunctionComponent<WorkoutViewModel> = (workout) => (
    <>
        <a href={workout.link}><Image src={workout.imageURL} /></a>
        <TextArea>
            <a href={workout.link}><Title>{workout.name}</Title></a>
            <Subtitle>{workout.startString}</Subtitle>
        </TextArea>
    </>
);

export default WorkoutCard;
