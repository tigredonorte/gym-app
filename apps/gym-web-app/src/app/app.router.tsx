import { AuthPath, AuthRouter } from '@gym-app/auth/web';
import { ProfilePath, ProfileRouter, useAuth, UserPath, UserRouter } from '@gym-app/user/web';
import { mdiCreditCardOutline } from '@mdi/js';
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Billing } from './Billing/Billing';
import { TemplateComponent } from './Template';

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
    <TemplateComponent>
      <Routes>
        <Route path={`/${ProfilePath}/*`} element={
          <ProfileRouter extraMenu={extraMenu}>
            <Route path="billing" element={<Billing />} />
          </ProfileRouter>
        } />
        <Route path={`/${UserPath}/*`} element={<UserRouter />} />
        <Route path="*" element={<Navigate to={`/${ProfilePath}`} />} />
      </Routes>
    </TemplateComponent>
  );
};

