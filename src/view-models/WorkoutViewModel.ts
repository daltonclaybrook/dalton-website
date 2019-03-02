interface WorkoutViewModel {
    id: number;
    name: string;
    link: string;
    startString: string;
    durationString: string;
    imageURL: string;

    distance: string;
    averageSpeed: string;
    maxSpeed: string;
    averageCadence: string;
    averagePower: string;
    maxPower: string;
    kilojoules: string;
}

export default WorkoutViewModel;
