interface Location {
    lat: number;
    long: number;
    city: string;
    state: string;
}

interface Checkin {
    id: string;
    venueName: string;
    createdAt: number;
    imageURL?: string;
    location: Location;
}

export default Checkin;
