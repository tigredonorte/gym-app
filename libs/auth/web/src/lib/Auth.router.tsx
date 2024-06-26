import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import ConfirmRecoverPassword from './pages/ForgotPassword/ConfirmRecoverPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

export const AuthPath = 'auth';
export const AuthRouter: React.FC = () => (
  <Routes>
    <Route index Component={Login} />
    <Route path='forgot-password' Component={ForgotPassword} />
    <Route path='confirm-recover' Component={ConfirmRecoverPassword} />
    <Route path='change-password' Component={ChangePassword} />
    <Route path='signup' Component={Signup} />
  </Routes>
);
