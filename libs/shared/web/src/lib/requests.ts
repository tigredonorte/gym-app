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
    const context = getEnvData();
    const headers: Record<string, string> = {};

    let body = undefined;
    if (formData) {
      body = formData instanceof FormData ? formData : JSON.stringify(formData);
    }
    if (!(formData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      headers['Session-Id'] = sessionId;
    }

    const accessId = localStorage.getItem('accessId');
    if (accessId) {
      headers['Access-Id'] = accessId;
    }

    path = path.startsWith('/') ? path.slice(1) : path;
    const response = await fetch(`${context.backendEndpoint}/${path}`, {
      method,
      headers,
      body,
    });

    const isTokenExpired = response.status === 401 && token;
    if (isTokenExpired) {
      console.error('Token expired, logging out');
      window.location.href = '/user/logout';
    }

    const contentType = response.headers.get('Content-Type');
    let result: RequestResponse;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = (await response.text()) as unknown as RequestResponse;
    }

    if (!response.ok) {
      const errorMessage: string = result && typeof result === 'object' && 'message' in result ? (result.message as string) : 'Failed to fetch data';
      const error = new Error(errorMessage || 'Failed to fetch data');
      if (result && typeof result === 'object') {
        Object.assign(error, result);
      }
      throw error;
    }
    return result as RequestResponse;
  } catch (error) {
    console.error('Failure while fetching data', error);
    throw error;
  }
};

export const getRequest = <RequestResponse>(path: string) => request<undefined, RequestResponse>({
  method: 'GET', path,
});
export const postRequest = <RequestResponse>(path: string, formData: unknown) => request<typeof formData, RequestResponse>({
  method: 'POST', formData, path,
});

export const putRequest = <RequestResponse, RequestData>(path: string, formData: RequestData) => request<RequestData, RequestResponse>({
  method: 'PUT', formData, path,
});

export const deleteRequest = <RequestResponse>(path: string) => request<undefined, RequestResponse>({
  method: 'DELETE', path,
});
