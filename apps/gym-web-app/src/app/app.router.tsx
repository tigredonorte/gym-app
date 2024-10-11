import { AuthPath, AuthRouter } from '@gym-app/auth/web';
import { Header } from '@gym-app/shared/web';
import { ProfilePath, ProfileRouter, useAuth, UserPath, UserRouter } from '@gym-app/user/web';
import { mdiCreditCardOutline } from '@mdi/js';
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Billing } from './Billing/Billing';
import { drawerMenuItemList, menuItems } from './menuItems';

const extraMenu = [
  {
    id: uuid(),
    name: 'billing',
    icon: mdiCreditCardOutline,
    text: 'Billing',
  },
];

export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  useLocation();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path={`/${AuthPath}/*`} element={<AuthRouter />} />
        <Route path={`/${UserPath}/*`} element={<UserRouter />} />
        <Route path="*" element={<Navigate to={`/${AuthPath}`} />} />
      </Routes>
    );
  }

  return (
    <>
      <Header siteTitle="Gym App" menuItems={menuItems} drawerMenuItemList={drawerMenuItemList} />
      <main>
        <Routes>
          <Route path={`/${ProfilePath}/*`} element={
            <ProfileRouter extraMenu={extraMenu}>
              <Route path="billing" element={<Billing />} />
            </ProfileRouter>
          } />
          <Route path={`/${UserPath}/*`} element={<UserRouter />} />
          <Route path="*" element={<Navigate to={`/${ProfilePath}`} />} />
        </Routes>
      </main>
    </>
  );
};

