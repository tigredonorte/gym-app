import { postRequest } from '@gym-app/shared/web';
import React from 'react';

export const Logout: React.FC = () => {

  const [errorMessage, setErrorMessage] = React.useState('');
  const logout = async() => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }

      const sessionId = JSON.parse(userData).sessionId;
      const data = { sessionId };
      await postRequest('/auth/logout', data);
    } catch (error) {
      const message = 'Error logging out on server side. Redirecting to login page.';
      console.error(message, error);
      setErrorMessage(message);
    } finally {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <div>
      {errorMessage}
    </div>
  );
};