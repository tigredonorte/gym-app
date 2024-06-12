import { EnvContext } from "@gym-app/shared/web";
import React from "react";

export const Logout: React.FC = () => {

  const [errorMessage, setErrorMessage] = React.useState('');
  const context = React.useContext(EnvContext);
  const logout = async() => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }

      const sessionId = JSON.parse(userData).sessionId;
      const data = { sessionId }
      const response = await fetch(`${context.backendEndpoint}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      localStorage.removeItem('userData');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out on server side. Redirecting to login page.', error);
      setErrorMessage('Error logging out on server side. Redirecting to login page.');
      setTimeout(() => {
        localStorage.removeItem('userData');
        window.location.href = '/';
      }, 2000);
    }
  }

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <div>
      {errorMessage}
    </div>
  );
}