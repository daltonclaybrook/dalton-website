import React from 'react';

interface ILocation {
    lat: number;
    long: number;
    city: string;
    state: string;
}

interface ICheckin {
    id: string;
    venueName: string;
    createdAt: Date;
    imageURL?: string;
    location: ILocation;
}

export default ICheckin;
