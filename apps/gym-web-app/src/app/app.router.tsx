import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthPath, AuthRouter } from '@gym-app/auth/web';
import { UserPath, UserRouter } from '../modules/user/User.router';

const isAuthenticated = () => {
  const userData = localStorage.getItem('userData');
  return !!userData;
};

export const AppRouter: React.FC = () => {
  useLocation();

  if (!isAuthenticated()) {
    return (
      <Routes>
        <Route path={`/${AuthPath}/*`} element={<AuthRouter />} />
        <Route path="*" element={<Navigate to={`/${AuthPath}`} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path={`/${UserPath}/*`} element={<UserRouter />} />
      <Route path="*" element={<Navigate to={`/${UserPath}`} />} />
    </Routes>
  );
}

