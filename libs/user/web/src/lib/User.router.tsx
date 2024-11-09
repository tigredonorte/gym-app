import { MenuOption } from '@gym-app/shared/web';
import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { loadUserTranslations } from '../locales';
import { UserGrid } from './components/UserGrid';
import { UserMenu } from './components/UserMenu';
import { Account } from './pages/Account/Account';
import { Confirm } from './pages/Confirm/Confirm';
import { Logout } from './pages/Logout/Logout';

interface ProfileRouterProps {
  children: React.ReactNode;
  extraMenu?: MenuOption[];
}
export const ProfilePath = 'profile';
export const ProfileRouter: React.FC<ProfileRouterProps> = (props: ProfileRouterProps) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    (async () => {
      await loadUserTranslations();
      setLoading(false);
    })();
    return () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return (
      <Icon path={mdiLoading} size={2} spin={true}/>
    );
  }

  return (
    <UserGrid menu={<UserMenu extraMenu={props.extraMenu} />}>
      <Routes>
        <Route path="/" element={<Navigate to="/profile/account" />} />
        <Route path='account' element={<Account />} />
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
