import React, { Component } from 'react';
import styled from 'styled-components';
import { makeTimeString } from '../../business/time';
import Checkin from '../../models/Checkin';
import CheckinDetails from '../../models/CheckinDetails';

const unselectedMarkerOpacity = 0.5;

const Map = styled.div`
    height: 100%;
`;

interface GoogleMapProps {
    checkins: Checkin[];
    setSelected(details: CheckinDetails): void;
}

interface GoogleMapState {
    hasGoogleLoaded: boolean;
    mapRef: React.RefObject<HTMLDivElement>;
}

type Marker = google.maps.Marker;
type PlacesService = google.maps.places.PlacesService;
type PlaceResult = google.maps.places.PlaceResult;

class GoogleMap extends Component<GoogleMapProps, GoogleMapState> {
    private map?: google.maps.Map = undefined;
    private markers: Marker[] = [];

    constructor(props: GoogleMapProps) {
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
        this.createMap();
        this.updateMap();
    }

    public componentDidMount = () => {
        if (this.state.hasGoogleLoaded) {
            this.createMap();
            this.updateMap();
        }
    }

    public shouldComponentUpdate = (nextProps: GoogleMapProps, nextState: GoogleMapState) => {
        return nextState.hasGoogleLoaded && !this.state.hasGoogleLoaded;
    }

    // MARK: - Private

    private googleInit = () => {
        window.hasGoogleLoaded = true;
        this.setState({ hasGoogleLoaded: true });
    }

    private createMap = () => {
        const node = this.state.mapRef.current;
        if (node) {
            this.map = new google.maps.Map(node);
        }
    }

    private updateMap = () => {
        if (!this.map) { return; }
        this.markers.forEach((m) => m.setMap(null));
        this.markers = [];

        const { checkins } = this.props;
        const service = new google.maps.places.PlacesService(this.map);
        this.recursiveFetchPlace(0, Number.MAX_SAFE_INTEGER, checkins, service);
    }

    private recursiveFetchPlace = (index: number, selectedIndex: number, checkins: Checkin[], service: PlacesService) => {
        const maxMarkers = 3;
        if (checkins.length <= index || this.markers.length >= maxMarkers) {
            return;
        }

        const checkin = checkins[index];
        let returnSelected = selectedIndex;
        this.fetchPlaceId(checkin, service)
            .then(this.fetchPlaceDetails(checkin, service))
            .then((details) => {
                if (this.markers.length >= maxMarkers) { return; }
                const marker = this.createMarker(details);
                marker.setOpacity(unselectedMarkerOpacity);

                this.markers.push(marker);
                this.fitMapBoundsToMarkers(this.markers);

                if (index < returnSelected) {
                    returnSelected = index;
                    this.setMarkerSelected(marker, details);
                }
            })
            // delay each fetch due to google OVER_QUERY_LIMIT error
            .then(this.delay(500))
            .catch((reason) => console.log(reason))
            .finally(() => {
                this.recursiveFetchPlace(index + 1, returnSelected, checkins, service);
            });
    }

    // MARK: - Fetching

    private fetchPlaceId = (checkin: Checkin, service: PlacesService): Promise<string> => {
        return new Promise((resolve, reject) => {
            service.findPlaceFromQuery({
                query: checkin.venueName,
                fields: ['place_id', 'geometry'],
                locationBias: new google.maps.LatLng(checkin.location.lat, checkin.location.long),
            }, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    return reject(`bad place id response for checkin: ${checkin.venueName}`);
                }
                const closest = this.closestPlace(checkin, results);
                if (closest) {
                    resolve(closest.place_id);
                } else {
                    reject(`no close results for checkin: ${checkin.venueName}`);
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
                    return reject(`bad details response for checkin: ${checkin.venueName}, status: ${status}`);
                }

                const details: CheckinDetails = {
                    name: checkin.venueName,
                    lat: place.geometry.location.lat(),
                    long: place.geometry.location.lng(),
                    address: place.formatted_address,
                    dateString: makeTimeString(checkin.createdAt),
                    linkURL: place.website || place.url,
                    photos: place.photos.map((p) => p.getUrl({})),
                    stickerImageURL: checkin.imageURL,
                };
                resolve(details);
            });
        });
    }

    // MARK: - Helpers

    private delay = (milliseconds: number) => (): Promise<void> => {
        return new Promise((resolve) => {
            window.setTimeout(() => resolve(), milliseconds);
        });
    }

    private createMarker = (details: CheckinDetails): Marker => {
        const position = new google.maps.LatLng(details.lat, details.long);
        const marker = new google.maps.Marker({
            title: details.name,
            position,
            map: this.map,
            animation: google.maps.Animation.DROP,
        });
        marker.addListener('click', () => this.setMarkerSelected(marker, details));
        return marker;
    }

    private setMarkerSelected = (marker: Marker, details: CheckinDetails) => {
        this.props.setSelected(details);
        this.markers.forEach((m) => {
            const opacity = marker === m ? 1.0 : unselectedMarkerOpacity;
            m.setOpacity(opacity);
        });
    }

    private fitMapBoundsToMarkers = (markers: Marker[]) => {
        if (!this.map || !this.state.hasGoogleLoaded) { return; }
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
        });
        this.map.fitBounds(bounds);
    }

    private closestPlace = (checkin: Checkin, results: PlaceResult[]): PlaceResult | null => {
        let closest: PlaceResult | null = null;
        let closestDiff = Number.MAX_SAFE_INTEGER;
        results.forEach((r) => {
            const lat = r.geometry.location.lat();
            const long = r.geometry.location.lng();
            const diff = this.difference({ lat, long }, checkin.location);
            if (diff < closestDiff) {
                closest = r;
                closestDiff = diff;
            }
        });

        // approx 1/2 mile latitude.
        const threshold = 1.0 / 140.0;
        return closestDiff <= threshold ? closest : null;
    }

    private difference = (loc1: { lat: number, long: number }, loc2: { lat: number, long: number }): number => {
        const latDiff = Math.abs(loc1.lat - loc2.lat);
        const longDiff = Math.abs(loc1.long - loc2.long);
        return (latDiff + longDiff) / 2;
    }
}

export default GoogleMap;
