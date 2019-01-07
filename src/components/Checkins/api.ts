import ICheckin from '../../models/ICheckin';

interface ICheckinsResponse {
    data: ICheckin[];
}

enum ErrorReason {
    NotOK = 'not ok',
}

const ENDPOINT = 'https://h6jmn6e3vk.execute-api.us-east-1.amazonaws.com/prod/checkins';

const isError = (response: Response) => !response.ok;

export const fetchCheckins = async (): Promise<ICheckin[]> => {
    const response = await fetch(ENDPOINT);
    if (isError(response)) {
        throw new Error(ErrorReason.NotOK);
    }
    const json = await response.json() as ICheckinsResponse;
    return json.data;
};
