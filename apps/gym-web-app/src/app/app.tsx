import { EnvProvider } from '@gym-app/shared/web';
import React from 'react';
import { environment } from '../environments/environment';
import './app.module.scss';
import { AppRouter } from './app.router';
import { MUITheme } from './theme';

const App: React.FC = () => {
  return (
    <EnvProvider env={environment}>
      <MUITheme>
        <AppRouter />
      </MUITheme>
    </EnvProvider>
  );
};

export default App;
