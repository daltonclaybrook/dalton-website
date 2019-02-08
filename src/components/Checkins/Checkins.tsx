import React, { Component } from 'react';
import styled from 'styled-components';
import Checkin from '../../models/Checkin';
import CheckinDetails from '../../models/CheckinDetails';
import Header from '../shared/Header';
import { fetchCheckins } from './api';
import CheckinCard from './CheckinCard';
import Google from './Google';

const Box = styled.div`
    display: flex;
    margin: auto;
    height: 20rem;
`;

const CardBox = styled.div`
    flex: 30%;
    padding: 0 1rem;
    border: solid 1px darkgray;
`;

const MapBox = styled.div`
    flex: 70%;
`;

interface CheckinsState {
    checkins: Checkin[];
    selected?: CheckinDetails;
}

class Checkins extends Component<any, CheckinsState> {
    constructor(props: any) {
        super(props);
        this.state = { checkins: [] };
    }

    public render = () => {
        return (
            <div>
                <Header>Recently spotted</Header>
                {this.state.checkins.length > 0 &&
                    <Box>
                        <CardBox>
                            <CheckinCard details={this.state.selected} />
                        </CardBox>
                        <MapBox>
                            <Google checkins={this.state.checkins} selected={this.selectedDetails} />
                        </MapBox>
                    </Box>
                }
            </div>
        );
    }

    public componentDidMount = () => {
        fetchCheckins().then((checkins) => this.setState({ checkins }));
    }

    // MARK: - Private

    private selectedDetails = (details: CheckinDetails) => {
        this.setState({ selected: details });
    }
}

export default Checkins;
