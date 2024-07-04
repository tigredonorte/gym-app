import { getEnvData } from '@gym-app/shared/web';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface RequestInput<RequestData> {
  method: Method
  formData?: RequestData
  path: string
}

const request = async <RequestData, RequestResponse>({
  method,
  formData,
  path,
}: RequestInput<RequestData>): Promise<RequestResponse> => {
  try {
    const body = formData ? JSON.stringify(formData) : undefined;
    const context = getEnvData();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    path = path.startsWith('/') ? path.slice(1) : path;
    const response = await fetch(`${context.backendEndpoint}/${path}`, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failure while fetching data', error);
    throw error;
  }
};


export const getRequest = <RequestResponse>(path: string) => request<undefined, RequestResponse>({
  method: 'GET', path
});
export const postRequest = <RequestResponse>(path: string, formData: unknown) => request<typeof formData, RequestResponse>({
  method: 'POST', formData, path
});

export const putRequest = <RequestResponse, RequestData>(path: string, formData: RequestData) => request<RequestData, RequestResponse>({
  method: 'PUT', formData, path
});

export const deleteRequest = <RequestResponse>(path: string) => request<undefined, RequestResponse>({
  method: 'DELETE', path
});
