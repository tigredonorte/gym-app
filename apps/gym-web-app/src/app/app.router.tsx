import { AuthPath, AuthRouter } from '@gym-app/auth/web';
import { Header } from '@gym-app/ui-menu';
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { UserPath, UserRouter } from '../modules/user/User.router';
import { drawerMenuItemList, menuItems } from './menuItems';

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
    <>
      <Header siteTitle="Gym App" menuItems={menuItems} drawerMenuItemList={drawerMenuItemList} />
      <Routes>
        <Route path={`/${UserPath}/*`} element={<UserRouter />} />
        <Route path="*" element={<Navigate to={`/${UserPath}`} />} />
      </Routes>
    </>
  );
}

