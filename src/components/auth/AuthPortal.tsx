import React, { useState } from 'react';
import { UserRole, UserAccount } from '../../types/clinical.ts';
import { RoleSelection } from './RoleSelection.tsx';
import { Login } from './Login.tsx';
import { Register } from './Register.tsx';
import { ForgotPassword } from './ForgotPassword.tsx';
import { ResetPassword } from './ResetPassword.tsx';

interface AuthPortalProps {
  onAuthenticated: (user: UserAccount, token: string) => void;
}

type AuthView = 'role_selection' | 'login' | 'register' | 'forgot_password' | 'reset_password';

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthenticated }) => {
  const [currentView, setCurrentView] = useState<AuthView>('role_selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [resetEmail, setResetEmail] = useState<string>('');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentView('login');
  };

  const handleGoToRegister = (role?: UserRole) => {
    if (role) setSelectedRole(role);
    setCurrentView('register');
  };

  const handleForgotPassword = () => {
    setCurrentView('forgot_password');
  };

  const handleProceedToReset = (email: string) => {
    setResetEmail(email);
    setCurrentView('reset_password');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleBackToRoles = () => {
    setCurrentView('role_selection');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {currentView === 'role_selection' && (
        <RoleSelection
          onSelectRole={handleSelectRole}
          onGoToRegister={handleGoToRegister}
        />
      )}

      {currentView === 'login' && (
        <Login
          selectedRole={selectedRole}
          onLoginSuccess={onAuthenticated}
          onBackToRoles={handleBackToRoles}
          onGoToRegister={() => setCurrentView('register')}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {currentView === 'register' && (
        <Register
          initialRole={selectedRole}
          onRegistered={onAuthenticated}
          onBackToLogin={handleBackToLogin}
        />
      )}

      {currentView === 'forgot_password' && (
        <ForgotPassword
          onBackToLogin={handleBackToLogin}
          onProceedToReset={handleProceedToReset}
        />
      )}

      {currentView === 'reset_password' && (
        <ResetPassword
          email={resetEmail}
          onSuccess={handleBackToLogin}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
};
