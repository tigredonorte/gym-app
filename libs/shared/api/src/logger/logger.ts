import { Request } from 'express';
import * as util from 'util';
import * as winston from 'winston';
import { getSession } from './logger.metrics';

type Logger = winston.Logger;

const isDevelopment = () => process.env['NODE_ENV'] === 'development';

const splatSymbol = Symbol.for('splat');
export const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, [splatSymbol]: splatArgs = [] }) => {
      const isProd = !isDevelopment();
      const formattedMessage = [message, ...splatArgs].map((value) => {
        try {
          if (typeof value === 'object' || Array.isArray(value) || typeof value === 'function') {
            return util.inspect(value, {
              depth: 5,
              showHidden: false,
              showProxy: false,
              maxArrayLength: null,
              compact: isProd
            });
          }
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
          }
          if (typeof value === 'symbol' || typeof value === 'bigint') {
            return value.toString();
          }
          return String(value);
        } catch (error) {
          console.error(`Error formatting value: ${error}`);
          return value;
        }
      }).join(' ');

      const prefix = level;
      if (isProd) {
        const session = getSession();
        return JSON.stringify({
          ...session,
          level,
          timestamp,
          message: formattedMessage.replace(/\n/g, ' '),
        });
      }
      return `${prefix} ${formattedMessage}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export interface RequestWithLogger extends Request {
  logger: Logger;
}

