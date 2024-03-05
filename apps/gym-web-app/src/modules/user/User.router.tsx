import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Logout } from './pages/Logout/Logout';

export const UserPath = 'user';
export const UserRouter: React.FC = () => (
  <Routes>
    <Route index element={'profile'} />
    <Route path='logout' Component={Logout} />
  </Routes>
)
