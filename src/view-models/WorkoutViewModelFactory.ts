import Workout from '../models/Workout';
import WorkoutViewModel from './WorkoutViewModel';

const makeTimeStringFromSeconds = (seconds: number): string => {
    let secondsLeft = seconds;
    const hours = Math.floor(secondsLeft / 3600);
    secondsLeft -= hours * 3600;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= minutes * 60;

    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsString = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft.toString();
    return `${hours}:${minutesString}:${secondsString}`;
};

export const makeWorkoutViewModel = (workout: Workout): WorkoutViewModel => {
    const pelotonUserID = 'fe12e4e3cd1a41d5b7854144b7b1ea84';
    const pelotonWorkoutID = workout.external_id.replace(/\.tcx$/, '');
    const link = `https://members.onepeloton.com/members/${pelotonUserID}/workouts/${pelotonWorkoutID}`;
    const imageURL = `https://api.onepeloton.com/api/workout/metric_graphic/${pelotonWorkoutID}.png`;
    const startDate = new Date(workout.start_date);
    const durationString = makeTimeStringFromSeconds(workout.elapsed_time);
    return {
        id: workout.id,
        name: workout.name,
        link,
        startString: startDate.toLocaleString(),
        durationString: `Duration: ${durationString}`,
        imageURL,

        // todo
        distance: '',
        averageSpeed: '',
        maxSpeed: '',
        averageCadence: '',
        averagePower: '',
        maxPower: '',
        kilojoules: '',
    };
};
