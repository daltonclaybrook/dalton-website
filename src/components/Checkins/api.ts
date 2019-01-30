import { fetchEndpoint } from '../../business/api';
import Checkin from '../../models/Checkin';

interface CheckinsResponse {
    data: Checkin[];
}

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/checkins';

export const fetchCheckins = async (): Promise<Checkin[]> =>
    fetchEndpoint(ENDPOINT, (response: CheckinsResponse) => response.data);
