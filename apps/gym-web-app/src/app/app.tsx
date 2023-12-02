import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthRouter from '../modules/auth/Auth.router';

const isAuthenticated = () => {
  const userData = localStorage.getItem('userData');
  return !!userData;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onAuthRoute = location.pathname.startsWith('/auth');
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    } else {
      if (onAuthRoute) return;
      navigate('/auth');
    }
  }, [navigate]);

  // Render based on authentication
  return isAuthenticated() ? <div>User logged in</div> : <AuthRouter />;
}

export default App;
