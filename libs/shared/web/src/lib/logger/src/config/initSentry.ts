import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from 'react-router-dom';

export interface SentryParams {
  dsn: string;
  environment: string;
}

const ignoredErrors = ['ERR_CONNECTION_REFUSED'];

export const initSentry = ({ dsn, environment }: SentryParams): void => {
  if(Sentry.isInitialized() ) {
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
    ],

    beforeSend(event) {
      const errorMessage = event?.exception?.values?.[0]?.value || '';
      return (ignoredErrors.some((message) => errorMessage.includes(message))) ? null : event;
    },

    tracesSampleRate: 1.0,
    tracePropagationTargets: [new RegExp(window.location.host)],

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};