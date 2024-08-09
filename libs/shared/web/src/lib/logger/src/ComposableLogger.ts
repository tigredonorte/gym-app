import { ILogger, MessageType } from './ILogger';

export class ComposableLogger implements ILogger {
  private loggers: ILogger[];

  constructor(loggers: ILogger[]) {
    if (!loggers || loggers.length === 0) {
      throw new Error('At least one logger must be provided.');
    }
    this.loggers = loggers;
  }

  public log(message: MessageType, ...optionalParams: MessageType[]): void {
    this.loggers.forEach(logger => logger.log(message, ...optionalParams));
  }

  public info(message: MessageType, ...optionalParams: MessageType[]): void {
    this.loggers.forEach(logger => logger.info(message, ...optionalParams));
  }

  public warn(message: MessageType, ...optionalParams: MessageType[]): void {
    this.loggers.forEach(logger => logger.warn(message, ...optionalParams));
  }

  public error(message: MessageType, ...optionalParams: MessageType[]): void {
    this.loggers.forEach(logger => logger.error(message, ...optionalParams));
  }
}
