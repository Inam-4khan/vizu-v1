import React, { createContext, useReducer, useCallback } from 'react';

export const AppContext = createContext(null);

const initialState = {
  theme: 'dark', // 'light' | 'dark' | 'auto'
  notifications: [],
  sidebarOpen: false,
};

export const APP_ACTION_TYPES = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
};

export function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case APP_ACTION_TYPES.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };
    case APP_ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: action.payload.id || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...action.payload,
          },
        ],
      };
    case APP_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case APP_ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    case APP_ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case APP_ACTION_TYPES.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: Boolean(action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children, initialValue = initialState }) {
  const [state, dispatch] = useReducer(appReducer, initialValue);

  const setTheme = useCallback((theme) => {
    dispatch({ type: APP_ACTION_TYPES.SET_THEME, payload: theme });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: APP_ACTION_TYPES.TOGGLE_THEME });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({ type: APP_ACTION_TYPES.ADD_NOTIFICATION, payload: notification });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: APP_ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: APP_ACTION_TYPES.CLEAR_NOTIFICATIONS });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: APP_ACTION_TYPES.TOGGLE_SIDEBAR });
  }, []);

  const setSidebarOpen = useCallback((isOpen) => {
    dispatch({ type: APP_ACTION_TYPES.SET_SIDEBAR_OPEN, payload: isOpen });
  }, []);

  const value = {
    theme: state.theme,
    notifications: state.notifications,
    sidebarOpen: state.sidebarOpen,
    setTheme,
    toggleTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleSidebar,
    setSidebarOpen,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
