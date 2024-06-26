import { FormContainerType } from './FormContainer';

interface RequestType <T extends FormContainerType>{
  formData: T;
  errorMessage: string;
  url: string;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'| 'PATCH';
}

export async function executeRequest<T extends FormContainerType>  ({
  formData,
  errorMessage,
  url,
  method = 'POST',
}: RequestType<T>) {
  try {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { errorMessage };
    }

    return data;
  } catch (error) {
    console.error('Error during fetch operation', error);
    return { errorMessage };
  }
}