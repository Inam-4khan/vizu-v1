import apiClient from './client';

/**
 * Vizu Authentication API Services
 */

/**
 * Authenticates user credentials
 * @param {Object} credentials - { username, password }
 */
export async function loginApi(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

/**
 * Registers a new Vizu persona account
 * @param {Object} userData - { username, email, password, persona }
 */
export async function signupApi(userData) {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data;
}

/**
 * Logs out current session and revokes server token
 */
export async function logoutApi() {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    console.warn('Logout endpoint unreachable, clearing session');
  }
  return { success: true };
}

/**
 * Fetches current authenticated persona user details
 */
export async function getCurrentUserApi() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

