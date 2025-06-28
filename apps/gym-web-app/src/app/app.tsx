import { EnvProvider, initializeI18n, initSentry, TranslationProvider, WebSocketProvider } from '@gym-app/shared/web';
import { AuthProvider } from '@gym-app/user/web';
import * as Sentry from '@sentry/react';
import React from 'react';
import { Provider } from 'react-redux';
import { environment } from '../environments/environment';
import './app.module.scss';
import { AppRouter } from './app.router';
import { store } from './store';
import { MUITheme } from './theme';

initializeI18n();
initSentry({
  dsn: environment.sentryDsn,
  environment: environment.env
});

const App: React.FC = () => {
  return (
    <EnvProvider env={environment}>
      <Sentry.ErrorBoundary fallback={() => <p>Something went wrong.</p>}>
        <Provider store={store}>
          <WebSocketProvider>
            <TranslationProvider>
              <AuthProvider>
                <MUITheme>
                  <AppRouter />
                </MUITheme>
              </AuthProvider>
            </TranslationProvider>
          </WebSocketProvider>
        </Provider>
      </Sentry.ErrorBoundary>
    </EnvProvider>
  );
};

export default App;
