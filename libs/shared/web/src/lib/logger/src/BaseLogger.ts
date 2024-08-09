import { ILogger, MessageType } from './ILogger';

export class BaseLogger implements ILogger {
  private prefix: string;

  constructor(prefix?: string) {
    this.prefix = !prefix ? '' : `[${prefix}]: `;
  }

  private formatMessage(message: MessageType, ...optionalParams: MessageType[]): MessageType[] {
    return [this.prefix, message, ...optionalParams];
  }

  public log(message: MessageType, ...optionalParams: MessageType[]): void {
    console.log(...this.formatMessage(message, ...optionalParams));
  }

  public info(message: MessageType, ...optionalParams: MessageType[]): void {
    console.info(...this.formatMessage(message, ...optionalParams));
  }

  public warn(message: MessageType, ...optionalParams: MessageType[]): void {
    console.warn(...this.formatMessage(message, ...optionalParams));
  }

  public error(message: MessageType, ...optionalParams: MessageType[]): void {
    console.error(...this.formatMessage(message, ...optionalParams));
  }
}