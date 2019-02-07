import React from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';

const Map = styled.div`
    height: 100%;
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

        const markers = checkins.map((checkin) => {
            const location = new maps.LatLng(checkin.location.lat, checkin.location.long);
            const place = {
                location,
                query: checkin.venueName,
            };
            const marker = new maps.Marker({
                title: checkin.venueName,
                position: location,
                map: this.map,
                place,
            });
            marker.addListener('click', () => {
                console.log(`click: ${checkin.venueName}`);
            });
            marker.addListener('mouseover', () => {
                console.log(`mouseover: ${checkin.venueName}`);
            });
            marker.addListener('mouseout', () => {
                console.log(`mouseout: ${checkin.venueName}`);
            });
            return marker;
        });
        this.fitMapBoundsToMarkers(markers);
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
