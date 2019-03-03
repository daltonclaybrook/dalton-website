import { makeTimeString } from '../business/time';
import Workout from '../models/Workout';
import WorkoutViewModel from './WorkoutViewModel';

export const makeWorkoutViewModel = (workout: Workout): WorkoutViewModel => {
    const pelotonUserID = 'fe12e4e3cd1a41d5b7854144b7b1ea84';
    const pelotonWorkoutID = workout.external_id.replace(/\.tcx$/, '');
    const link = `https://members.onepeloton.com/members/${pelotonUserID}/workouts/${pelotonWorkoutID}`;
    const imageURL = `https://api.onepeloton.com/api/workout/metric_graphic/${pelotonWorkoutID}.png`;
    const startDateString = makeTimeString(workout.start_date);
    return {
        id: workout.id,
        name: workout.name,
        link,
        startString: startDateString,
        imageURL,
    };
};
