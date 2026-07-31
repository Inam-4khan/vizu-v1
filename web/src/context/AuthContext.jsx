import React, { createContext, useReducer, useCallback } from 'react';

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AUTH_ACTION_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

export function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : action.payload,
      };
    case AUTH_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children, initialValue = initialState }) {
  const [state, dispatch] = useReducer(authReducer, initialValue);

  const login = useCallback((userData) => {
    dispatch({ type: AUTH_ACTION_TYPES.LOGIN_START });
    // Simulate auth login logic / action dispatch
    if (userData) {
      dispatch({ type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, payload: userData });
    } else {
      dispatch({
        type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
        payload: 'Invalid user payload provided',
      });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
  }, []);

  const updateUser = useCallback((updatedFields) => {
    dispatch({ type: AUTH_ACTION_TYPES.UPDATE_USER, payload: updatedFields });
  }, []);

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    updateUser,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
