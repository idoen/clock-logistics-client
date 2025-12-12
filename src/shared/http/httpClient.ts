import axios from 'axios';
import type { ApiError, ApiErrorPayload } from './types';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = new Error('Request failed');
    if (error.response?.data?.error) {
      apiError.message = (error.response.data as ApiErrorPayload).error;
      apiError.payload = error.response.data as ApiErrorPayload;
    }
    return Promise.reject(apiError);
  },
);

export default client;
