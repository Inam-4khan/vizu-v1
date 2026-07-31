import axios from 'axios';

// Get API Base URL from environment variable or default fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.vizu.app/v1';

/**
 * Configured Axios instance for Vizu Web API calls
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor: Automatically attaches Bearer token from localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vizu_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handles global error codes (401 Unauthorized redirect)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid auth token
      localStorage.removeItem('vizu_auth_token');
      localStorage.removeItem('vizu_user');

      // Dispatch custom session expired event for reactive UI updates
      window.dispatchEvent(new CustomEvent('vizu:auth:unauthorized'));

      // If not already on login/welcome route, safely handle redirect
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.warn('Session expired (401). Token cleared.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
