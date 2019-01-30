enum ErrorReason {
    NotOK = 'not ok',
}

const isError = (response: Response) => !response.ok;
type Transformer<T> = (response: any) => T;

export const fetchEndpoint = async <T>(endpoint: string, transformer: Transformer<T>): Promise<T> => {
    const response = await fetch(endpoint);
    if (isError(response)) {
        throw new Error(ErrorReason.NotOK);
    }
    const json = await response.json();
    return transformer(json);
};
