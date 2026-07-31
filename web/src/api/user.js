import apiClient from './client';

/**
 * Vizu User & Profile API Services
 */

/**
 * Fetches persona profile details by user ID or current user
 * @param {string} [userId]
 */
export async function getProfileApi(userId) {
  try {
    const url = userId ? `/users/profile/${userId}` : '/users/profile/me';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return {
        id: userId || 'usr_vizu_1',
        username: 'alex_persona',
        displayName: 'Alex Rivers',
        bio: 'Creating spatial AR Vista experiences & Hush whisper nodes in NYC.',
        personaBadge: 'AR Creator & Proximity Streamer',
        ghostMode: false,
        followersCount: 1420,
        connectionsCount: 384,
      };
    }
    throw error.response?.data || error;
  }
}

/**
 * Updates current persona profile details
 * @param {Object} profileUpdates
 */
export async function updateProfileApi(profileUpdates) {
  try {
    const response = await apiClient.patch('/users/profile/me', profileUpdates);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      const current = JSON.parse(localStorage.getItem('vizu_user') || '{}');
      const updated = { ...current, ...profileUpdates };
      localStorage.setItem('vizu_user', JSON.stringify(updated));
      return updated;
    }
    throw error.response?.data || error;
  }
}

/**
 * Fetches nearby or connected persona users
 */
export async function getConnectionsApi() {
  try {
    const response = await apiClient.get('/users/connections');
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return [
        { id: 'u1', name: 'Kai Vance', username: 'kai_vista', isGhost: false, distance: '37m' },
        { id: 'u2', name: 'Ghost_Z', username: 'ghost_77', isGhost: true, distance: '110m' },
        { id: 'u3', name: 'Aria Chen', username: 'aria_spatial', isGhost: false, distance: '250m' },
      ];
    }
    throw error.response?.data || error;
  }
}

/**
 * Toggles ghost mode (encrypted proximity state) for current user
 * @param {boolean} enabled
 */
export async function toggleGhostModeApi(enabled) {
  try {
    const response = await apiClient.post('/users/ghost-mode', { enabled });
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { success: true, ghostMode: enabled };
    }
    throw error.response?.data || error;
  }
}
