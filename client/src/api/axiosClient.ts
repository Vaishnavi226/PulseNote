import axios from 'axios';
import { authEvents } from '../features/auth/authEvents';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pn_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Sanitization
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pn_auth_token');
      authEvents.emitInvalid();
    }
    return Promise.reject(error);
  }
);
