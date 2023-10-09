import React from 'react';
import AuthRouter from '../modules/auth/Auth.router';

const App: React.FC = () => {
  if (!localStorage.getItem('token')) {
    return (<AuthRouter />);
  }

  return (
    <>
      User logged in
    </>
  );
}

export default App;
