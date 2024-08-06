import { EnvProvider, WebSocketProvider } from '@gym-app/shared/web';
import { AuthProvider } from '@gym-app/user/web';
import React from 'react';
import { Provider } from 'react-redux';
import { environment } from '../environments/environment';
import './app.module.scss';
import { AppRouter } from './app.router';
import { store } from './store';
import { MUITheme } from './theme';

const App: React.FC = () => {
  return (
    <EnvProvider env={environment}>
      <Provider store={store}>
        <WebSocketProvider>
          <AuthProvider>
            <MUITheme>
              <AppRouter />
            </MUITheme>
          </AuthProvider>
        </WebSocketProvider>
      </Provider>
    </EnvProvider>
  );
};

export default App;
