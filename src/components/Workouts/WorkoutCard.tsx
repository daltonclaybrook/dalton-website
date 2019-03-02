import React, { FC, HTMLProps } from 'react';
import styled from 'styled-components';
import WorkoutViewModel from '../../view-models/WorkoutViewModel';
import ExternalLink from '../shared/ExternalLink';

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

type WorkoutProps =
    & WorkoutViewModel
    & {
        className?: string;
    };

const WorkoutCard: FC<WorkoutProps> = ({ className, ...workout }) => (
    <div className={className}>
        <ExternalLink href={workout.link}><Image alt={workout.name} src={workout.imageURL} /></ExternalLink>
        <TextArea>
            <ExternalLink href={workout.link}><Title>{workout.name}</Title></ExternalLink>
            <Subtitle>{workout.startString}</Subtitle>
        </TextArea>
    </div>
);

export default WorkoutCard;
