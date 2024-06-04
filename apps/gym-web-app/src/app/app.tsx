import { EnvProvider } from '@gym-app/shared/web';
import React from 'react';
import { environment } from '../environments/environment';
import { AppRouter } from './app.router';
import { ThemeProvider, createTheme } from '@mui/material';

const App: React.FC = () => {
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <EnvProvider env={environment}>
        <AppRouter />
      </EnvProvider>
    </ThemeProvider>
  )
}

export default App;
