import { MenuOption } from '@gym-app/ui';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserGrid } from './components/UserGrid';
import { UserMenu } from './components/UserMenu';
import { Account } from './pages/Account/Account';
import { Confirm } from './pages/Confirm/Confirm';
import { Logout } from './pages/Logout/Logout';
import { Security } from './pages/Security/Security';
import { loadUserTranslations } from '../locales';

interface ProfileRouterProps {
  children: React.ReactNode;
  extraMenu?: MenuOption[];
}
export const ProfilePath = 'profile';
export const ProfileRouter: React.FC<ProfileRouterProps> = (props: ProfileRouterProps) => {
  loadUserTranslations();
  return (
    <UserGrid menu={<UserMenu extraMenu={props.extraMenu} />}>
      <Routes>
        <Route path="/" element={<Navigate to="/profile/account" />} />
        <Route path='account' element={<Account />} />
        <Route path='security' element={<Security />} />
        {props.children}
        <Route path="*" element={<Navigate to="account" />} />
      </Routes>
    </UserGrid>
  );
};

export const UserPath = 'user';
export const UserRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/user" />} />
    <Route path='logout' element={<Logout />} />
    <Route path="confirm" element={<Confirm />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);
