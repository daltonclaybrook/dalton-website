interface Workout {
    id: number;
    name: string;
    elapsed_time: number;
    type: string;
    start_date: string;
    external_id: string;

    // metrics
    distance: number;
    average_speed: number;
    max_speed: number;
    average_cadence: number;
    average_watts: number;
    max_watts: number;
    kilojoules: number;
}

export default Workout;
