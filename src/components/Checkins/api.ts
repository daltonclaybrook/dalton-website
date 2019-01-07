import Checkin from '../../models/Checkin';

interface CheckinsResponse {
    data: Checkin[];
}

enum ErrorReason {
    NotOK = 'not ok',
}

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/checkins';

const isError = (response: Response) => !response.ok;

export const fetchCheckins = async (): Promise<Checkin[]> => {
    const response = await fetch(ENDPOINT);
    if (isError(response)) {
        throw new Error(ErrorReason.NotOK);
    }
    const json = await response.json() as CheckinsResponse;
    return json.data;
};
