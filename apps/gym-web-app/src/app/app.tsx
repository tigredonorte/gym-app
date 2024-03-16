import { EnvProvider } from '@gym-app/shared/web';
import React from 'react';
import { environment } from '../environments/environment';
import { AppRouter } from './app.router';

const App: React.FC = () => {
  return (
    <EnvProvider env={environment}>
      <AppRouter />
    </EnvProvider>
  )
}

export default App;
