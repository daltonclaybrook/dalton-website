import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    width: 400px;
    height: 400px;
    background-color: green;
`;

interface GoogleState {
    google?: typeof google;
    mapRef: React.RefObject<HTMLDivElement>;
}

class Google extends React.Component<any, GoogleState> {
    private map?: google.maps.Map = undefined;

    constructor(props: any) {
        super(props);
        window.googleInit = this.googleInit;
        this.state = {
            google: window.hasGoogleLoaded ? google : undefined,
            mapRef: React.createRef<HTMLDivElement>(),
        };
    }

    public render() {
        return <Box ref={this.state.mapRef}>Loading map...</Box>;
      }

    public componentDidUpdate() {
        if (google && !this.map) {
            this.loadMap();
        }
    }

    public componentDidMount() {
        this.loadMap();
    }

    // MARK: - Private

    private googleInit = () => {
        this.setState({ google });
    }

    private loadMap = () => {
        if (!this.state.google) {
            console.log('google is undefined');
            return;
        }
        console.log('google exists!');

        const maps = this.state.google.maps;
        const node = this.state.mapRef.current;

        const zoom = 14;
        const lat = 37.774929;
        const lng = -122.419416;
        const center = new maps.LatLng(lat, lng);
        const mapConfig = {
            center,
            zoom,
        };

        if (node instanceof HTMLDivElement) {
            this.map = new maps.Map(node, mapConfig);
        }
    }
}

export default Google;
