import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

export const genHttpError = (error: unknown): HttpException => {
  const err = error instanceof AxiosError ? {
    status: error.response?.status || error.status || 500,
    code: error.code,
    data: {
      data: error.response?.data,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`,
      method: error?.config?.method,
      requestData: error?.config?.data,
    }
  } : {
    status: 500,
    code: error instanceof Error ? error.name : 'UnknownError',
    data: error instanceof Error ? error.message : 'Unknown error',
  };

  return new HttpException(err.data, err.status, err.code ? { cause: err.code } : undefined);
};