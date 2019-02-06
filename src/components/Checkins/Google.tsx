import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    width: 400px;
    height: 400px;
    background-color: green;
`;

interface GoogleProps {
    lat: number;
    long: number;
    zoom: number;
}

interface GoogleState {
    google?: typeof google;
    mapRef: React.RefObject<HTMLDivElement>;
}

class Google extends React.Component<GoogleProps, GoogleState> {
    private map?: google.maps.Map = undefined;

    constructor(props: any) {
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
            this.map = new maps.Map(node, {
                disableDefaultUI: true,
                draggable: false,
                disableDoubleClickZoom: true,
            });
        }
    }

    private updateMapIfNecessary = () => {
        // bounce if map or google doesn't exist
        if (!this.map || !this.state.google) { return; }
        console.log('updating map...');

        const maps = this.state.google.maps;
        const { lat, long, zoom } = this.props;

        this.map.setOptions({
            center: new maps.LatLng(lat, long),
            zoom,
        });
    }
}

export default Google;
