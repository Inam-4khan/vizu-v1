import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Root rendering wrapper with AuthProvider & AppProvider context providers
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
