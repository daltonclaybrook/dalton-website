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

        const detailPromises = checkins.map((c) => this.fetchPlace(c, service));
        Promise.all(detailPromises).then((allDetails) => {
            return allDetails.map((details): google.maps.Marker|null => {
                if (!details) { return null; }
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
            });
        }).then((markers) => this.fitMapBoundsToMarkers(markers.filter(Boolean) as any));
    }

    private fitMapBoundsToMarkers = (markers: google.maps.Marker[]) => {
        if (!this.map || !this.state.hasGoogleLoaded) { return; }
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
        });
        this.map.fitBounds(bounds);
    }

    private fetchPlace = async (checkin: Checkin, service: PlacesService): Promise<CheckinDetails|null> => {
        return new Promise((resolve, reject) => {
            service.findPlaceFromQuery({
                query: checkin.venueName,
                fields: ['formatted_address', 'geometry', 'photos'],
                locationBias: new google.maps.LatLng(checkin.location.lat, checkin.location.long),
            }, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || results.length < 1) {
                    resolve(null);
                }

                const result = results[0];
                let photoURL = undefined as (string|undefined); // is there a more idiomatic way?
                if (result.photos.length > 0) {
                    photoURL = result.photos[0].getUrl({});
                }

                const details: CheckinDetails = {
                    name: checkin.venueName,
                    lat: result.geometry.location.lat(),
                    long: result.geometry.location.lng(),
                    address: result.formatted_address,
                    dateString: 'todo', // make me pretty
                    linkURL: result.url,
                    photoURL,
                    stickerImageURL: checkin.imageURL,
                };
                resolve(details);
            });
        });
    }
}

export default Google;
