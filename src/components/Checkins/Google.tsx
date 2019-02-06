import React from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';

const Box = styled.div`
    margin: auto;
    height: 400px;
    background-color: green;
`;

interface GoogleProps {
    checkins: Checkin[];
}

interface GoogleState {
    google?: typeof google;
    mapRef: React.RefObject<HTMLDivElement>;
}

class Google extends React.Component<GoogleProps, GoogleState> {
    private map?: google.maps.Map = undefined;

    constructor(props: GoogleProps) {
        super(props);
        window.googleInit = this.googleInit;
        this.state = {
            google: window.hasGoogleLoaded ? google : undefined,
            mapRef: React.createRef<HTMLDivElement>(),
        };
    }

    public render = () => {
        return <Box ref={this.state.mapRef}>Loading map...</Box>;
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
        this.setState({ google });
    }

    private createMapIfNecessary = () => {
        // bounce if map already exists, or google is not initialized
        if (this.map || !this.state.google) { return; }
        console.log('creating map...');

        const maps = this.state.google.maps;
        const node = this.state.mapRef.current;

        if (node instanceof HTMLDivElement) {
            // this.map = new maps.Map(node, {
            //     disableDefaultUI: true,
            //     draggable: false,
            //     disableDoubleClickZoom: true,
            // });
            this.map = new maps.Map(node);
        }
    }

    private updateMapIfNecessary = () => {
        // bounce if map or google doesn't exist
        if (!this.map || !this.state.google) { return; }
        console.log('updating map...');

        const maps = this.state.google.maps;
        const { checkins } = this.props;
        const service = new maps.places.PlacesService(this.map);

        const markers: google.maps.Marker[] = [];
        checkins.forEach((checkin) => {
            console.log(`loading... ${checkin.venueName}`);
            service.findPlaceFromQuery({
                query: checkin.venueName,
                fields: ['name', 'geometry', 'place_id'],
                locationBias: new maps.LatLng(checkin.location.lat, checkin.location.long),
            }, (results, status) => {
                if (status !== maps.places.PlacesServiceStatus.OK || results.length < 1) { return; }
                const result = results[0];
                console.log(`loaded: ${result.name}, keys: ${Object.keys(result)}`);

                const place = {
                    location: result.geometry.location,
                    placeId: result.place_id,
                };
                const marker = new maps.Marker({
                    title: result.name,
                    position: result.geometry.location,
                    map: this.map,
                    place,
                });
                markers.push(marker);
                this.fitMapBoundsToMarkers(markers);
            });
        });
    }

    private fitMapBoundsToMarkers = (markers: google.maps.Marker[]) => {
        if (!this.map || !this.state.google) { return; }
        const maps = this.state.google.maps;
        const bounds = new maps.LatLngBounds();
        markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
        });
        this.map.fitBounds(bounds);
    }
}

export default Google;
