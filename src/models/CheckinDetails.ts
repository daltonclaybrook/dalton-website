interface CheckinDetails {
    name: string;
    lat: number;
    long: number;
    address: string;
    dateString: string;
    linkURL?: string;
    photos: string[];
    stickerImageURL?: string;
}

export default CheckinDetails;
