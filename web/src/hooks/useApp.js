import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Custom hook to access AppContext state and methods (theme, notifications, sidebar).
 * Throws an error if used outside an AppProvider.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
