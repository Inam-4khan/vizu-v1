import React from 'react';
import { Login } from '../../src/pages/Login';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, onSignUp }) => {
  return (
    <Login
      onLogin={onLogin}
      onSignUp={onSignUp}
      onSwitchToSignup={onSignUp}
      onBack={onBack}
    />
  );
};
