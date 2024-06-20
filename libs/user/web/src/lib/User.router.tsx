import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserMenu } from './components/UserMenu';
import { Account } from './pages/Account/Account';
import { Billing } from './pages/Billing/Billing';
import { Logout } from './pages/Logout/Logout';
import { Profile } from './pages/Profile/Profile';
import { Security } from './pages/Security/Security';
import { UserGrid } from './components/UserGrid';

export const UserPath = 'user';
export const UserRouter: React.FC = () => (
  <UserGrid menu={<UserMenu />}>
    <Routes>
      <Route index element={<Account />} />
      <Route path='account' element={<Account />} />
      <Route path='profile' element={<Profile />} />
      <Route path='billing' element={<Billing />} />
      <Route path='security' element={<Security />} />
      <Route path='logout' element={<Logout />} />
      <Route path="*" element={<Navigate to="account" />} />
    </Routes>
  </UserGrid>
)
