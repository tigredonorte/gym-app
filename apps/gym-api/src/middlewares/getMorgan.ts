import morgan from 'morgan';
import chalk from 'chalk';

export function getMorgan() {
  morgan.token('ip', (req) => req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  return morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor = status >= 500 ? 'red' : status >= 400 ? 'yellow' : status >= 300 ? 'cyan' : 'green';
    const responseTime = parseInt(tokens['response-time'](req, res), 10);
    const responseTimeColor = responseTime >= 1000 ? 'red' : responseTime >= 500 ? 'yellow' : responseTime >= 250 ? 'cyan' : 'green';
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      chalk[statusColor](status),
      chalk[responseTimeColor](responseTime + 'ms'),
      tokens.ip(req, res),
      new Date().toISOString(),
    ].join(' ');
  }, {
    skip: (req) => req.url.includes('/static') || req.method === 'OPTIONS',
  });
}