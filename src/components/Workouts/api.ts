import { fetchEndpoint } from '../../business/api';
import Workout from '../../models/Workout';

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/workouts';

export const fetchWorkouts = async (): Promise<Workout[]> =>
    fetchEndpoint(ENDPOINT, (workouts: Workout[]) => workouts);
