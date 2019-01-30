interface Workout {
    id: number;
    name: string;
    distance: number;
    elapsed_time: number;
    type: string;
    start_date: string;

    // metrics
    average_speed: number;
    max_speed: number;
    average_cadence: number;
    average_watts: number;
    max_watts: number;
    kilojoules: number;
}

export default Workout;
