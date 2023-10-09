import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ConfirmRecoverPassword from './pages/ConfirmRecoverPassword';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';

const base = '/auth';
const AuthRouter: React.FC = () => (
  <Routes>
    <Route path={base} Component={Login} />
    <Route path={`${base}/forgot-password}`} Component={ForgotPassword} />
    <Route path={`${base}/confirm-recover`} Component={ConfirmRecoverPassword} />
    <Route path={`${base}/signup`} Component={Signup} />
  </Routes>
)

export default AuthRouter;