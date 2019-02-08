import React from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import CheckinDetails from '../../models/CheckinDetails';

const Map = styled.div`
    height: 100%;
`;

interface GoogleProps {
    checkins: Checkin[];
}

interface GoogleState {
    hasGoogleLoaded: boolean;
    mapRef: React.RefObject<HTMLDivElement>;
}

type PlacesService = google.maps.places.PlacesService;
type Marker = google.maps.Marker;

class Google extends React.Component<GoogleProps, GoogleState> {
    private map?: google.maps.Map = undefined;

    constructor(props: GoogleProps) {
        super(props);
        window.googleInit = this.googleInit;
        this.state = {
            hasGoogleLoaded: window.hasGoogleLoaded,
            mapRef: React.createRef<HTMLDivElement>(),
        };
    }

    public render = () => {
        return <Map ref={this.state.mapRef}>Loading map...</Map>;
    }

    public componentDidUpdate = () => {
        this.createMapIfNecessary();
        this.updateMapIfNecessary();
    }

    public componentDidMount = () => {
        this.createMapIfNecessary();
        this.updateMapIfNecessary();
    }

    // MARK: - Private

    private googleInit = () => {
        console.log('google init in component');
        window.hasGoogleLoaded = true;
        this.setState({ hasGoogleLoaded: true });
    }

    private createMapIfNecessary = () => {
        // bounce if map already exists, or google is not initialized
        if (this.map || !this.state.hasGoogleLoaded) { return; }
        console.log('creating map...');

        const node = this.state.mapRef.current;
        if (node instanceof HTMLDivElement) {
            // this.map = new maps.Map(node, {
            //     disableDefaultUI: true,
            //     draggable: false,
            //     disableDoubleClickZoom: true,
            // });
            this.map = new google.maps.Map(node);
        }
    }

    private updateMapIfNecessary = () => {
        // bounce if map or google doesn't exist
        if (!this.map || !this.state.hasGoogleLoaded) { return; }
        console.log('updating map...');

        const { checkins } = this.props;
        const service = new google.maps.places.PlacesService(this.map);

        const markers: Marker[] = [];
        checkins.forEach((checkin) => {
            this.fetchPlaceId(checkin, service)
                .then(this.fetchPlaceDetails(checkin, service))
                .then(this.createMarker)
                .then((marker) => {
                    markers.push(marker);
                    this.fitMapBoundsToMarkers(markers);
                })
                .catch((reason) => console.log(reason));
        });
    }

    private createMarker = (details: CheckinDetails): Marker => {
        const position = new google.maps.LatLng(details.lat, details.long);
        const marker = new google.maps.Marker({
            title: details.name,
            position,
            map: this.map,
        });
        marker.addListener('click', () => {
            console.log(`click: ${details.name}`);
        });
        marker.addListener('mouseover', () => {
            console.log(`mouseover: ${details.name}`);
        });
        marker.addListener('mouseout', () => {
            console.log(`mouseout: ${details.name}`);
        });
        return marker;
    }

    private fitMapBoundsToMarkers = (markers: Marker[]) => {
        if (!this.map || !this.state.hasGoogleLoaded) { return; }
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
        });
        this.map.fitBounds(bounds);
    }

    private fetchPlaceId = (checkin: Checkin, service: PlacesService): Promise<string> => {
        return new Promise((resolve, reject) => {
            service.findPlaceFromQuery({
                query: checkin.venueName,
                fields: ['place_id'],
                locationBias: new google.maps.LatLng(checkin.location.lat, checkin.location.long),
            }, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || results.length < 1) {
                    reject(`bad place id response for checkin: ${checkin.venueName}`);
                } else {
                    resolve(results[0].place_id);
                }
            });
        });
    }

    private fetchPlaceDetails = (checkin: Checkin, service: PlacesService) => (placeId: string): Promise<CheckinDetails> => {
        return new Promise((resolve, reject) => {
            service.getDetails({
                placeId,
                fields: ['formatted_address', 'geometry', 'icon', 'photo', 'url', 'website'],
            }, (place, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
                    reject(`bad details response for checkin: ${checkin.venueName}`);
                }

                let photoURL: (string|undefined);
                if (place.photos.length > 0) {
                    photoURL = place.photos[0].getUrl({});
                }

                const details: CheckinDetails = {
                    name: checkin.venueName,
                    lat: place.geometry.location.lat(),
                    long: place.geometry.location.lng(),
                    address: place.formatted_address,
                    dateString: 'todo', // make me pretty
                    linkURL: place.website || place.url,
                    photoURL,
                    stickerImageURL: checkin.imageURL,
                };
                console.log(details);
                resolve(details);
            });
        });
    }
}

export default Google;
