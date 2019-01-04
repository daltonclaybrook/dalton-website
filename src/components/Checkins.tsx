import React, { Component } from 'react';

interface ICheckinsResponse {
    data: ICheckin[];
}

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

interface ICheckinsState {
    checkins: ICheckin[];
}

const Checkin = (checkin: ICheckin) => (
    <div className="checkin">
        <h3>{checkin.venueName}</h3>
        {/* <h4>{checkin.createdAt.toDateString()}</h4> */}
    </div>
);

class Checkins extends Component<any, ICheckinsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            checkins: [],
        };
    }

    public render() {
        return (
            <div className="checkins">
                <h2>Checkins</h2>
                {this.state.checkins.map((checkin) => <Checkin key={checkin.id} {...checkin}/>)}
            </div>
        );
    }

    public componentDidMount() {
        this.fetchCheckins();
    }

    // MARK: - Private

    private fetchCheckins() {
        fetch('https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/checkins')
            .then((response) => {
                if (!response.ok) { throw Error('not ok'); }
                return response.json();
            })
            .then((response: ICheckinsResponse) => response.data)
            .then((checkins) => this.setState({ checkins }));
    }
}

export default Checkins;
