import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';

const CombinedTestComponent = () => {
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();
  const { theme, toggleTheme, notifications, addNotification, clearNotifications } = useApp();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? `Logged in: ${user?.username}` : 'Logged out'}</div>
      <div data-testid="app-theme">Theme: {theme}</div>
      <div data-testid="notif-count">Notifications: {notifications.length}</div>

      <button
        onClick={() =>
          login({
            id: '101',
            username: 'vizu_tester',
            displayName: 'Vizu Tester',
          })
        }
      >
        Login Action
      </button>

      <button onClick={() => updateUser({ displayName: 'Updated Tester' })}>
        Update User Action
      </button>

      <button onClick={logout}>Logout Action</button>

      <button onClick={toggleTheme}>Toggle Theme Action</button>

      <button onClick={() => addNotification({ message: 'New Test Alert' })}>
        Add Notification
      </button>

      <button onClick={clearNotifications}>Clear Notifications</button>
    </div>
  );
};

describe('AuthContext and AppContext State Management', () => {
  it('manages AuthContext state correctly with useReducer actions', () => {
    render(
      <AuthProvider>
        <AppProvider>
          <CombinedTestComponent />
        </AppProvider>
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out');

    // Test Login
    fireEvent.click(screen.getByText('Login Action'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in: vizu_tester');

    // Test Update User
    fireEvent.click(screen.getByText('Update User Action'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in: vizu_tester');

    // Test Logout
    fireEvent.click(screen.getByText('Logout Action'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out');
  });

  it('manages AppContext state correctly with theme and notification actions', () => {
    render(
      <AuthProvider>
        <AppProvider>
          <CombinedTestComponent />
        </AppProvider>
      </AuthProvider>
    );

    expect(screen.getByTestId('app-theme')).toHaveTextContent('Theme: dark');
    expect(screen.getByTestId('notif-count')).toHaveTextContent('Notifications: 0');

    // Toggle Theme
    fireEvent.click(screen.getByText('Toggle Theme Action'));
    expect(screen.getByTestId('app-theme')).toHaveTextContent('Theme: light');

    // Add Notification
    fireEvent.click(screen.getByText('Add Notification'));
    expect(screen.getByTestId('notif-count')).toHaveTextContent('Notifications: 1');

    // Clear Notifications
    fireEvent.click(screen.getByText('Clear Notifications'));
    expect(screen.getByTestId('notif-count')).toHaveTextContent('Notifications: 0');
  });
});
