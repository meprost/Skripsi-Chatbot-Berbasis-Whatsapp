import axios from 'axios';

import env from './env';

export const backendApi = axios.create({
  baseURL: env.BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paymentApi = axios.create({
  baseURL: env.PAYMENT_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export type BackendApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: unknown;
    };
