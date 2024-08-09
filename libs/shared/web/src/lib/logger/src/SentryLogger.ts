import * as Sentry from '@sentry/react';
import { getUserData, ILogger, MessageType } from './ILogger';

enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

let sentryInitialized = false;
export class SentryLogger implements ILogger {
  constructor(private userData = getUserData()) {
    if (sentryInitialized) {
      return;
    }
    sentryInitialized = true;
    const originalConsoleError = console.error;
    console.error = (...args: never[]) => {
      this.sendToSentry(LogLevel.ERROR, args[0], args.slice(1));
      originalConsoleError.apply(console, args);
    };
  }

  public log(message: MessageType, ...optionalParams: MessageType[]): void {
    this.sendToSentry(LogLevel.DEBUG, message, optionalParams);
  }

  public info(message: MessageType, ...optionalParams: MessageType[]): void {
    this.sendToSentry(LogLevel.INFO, message, optionalParams);
  }

  public warn(message: MessageType, ...optionalParams: MessageType[]): void {
    this.sendToSentry(LogLevel.WARNING, message, optionalParams);
  }

  public error(message: MessageType, ...optionalParams: MessageType[]): void {
    this.sendToSentry(LogLevel.ERROR, message, optionalParams);
  }

  private sendToSentry(level: LogLevel, message: MessageType, optionalParams: MessageType[]): void {
    Sentry.withScope(scope => {
      scope.setLevel(level);
      if (this.userData) {
        scope.setUser(this.userData);
      }
      scope.setExtra('details', optionalParams);
      Sentry.captureMessage(message);
    });
  }
}
