import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Profile } from './pages/Profile/Profile';
import { Logout } from './pages/Logout/Logout';

export const UserPath = 'user';
export const UserRouter: React.FC = () => (
  <Routes>
    <Route index Component={Profile} />
    <Route path='logout' Component={Logout} />
  </Routes>
)
