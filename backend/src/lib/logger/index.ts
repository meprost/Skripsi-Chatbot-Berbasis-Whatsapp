import { nanoid } from 'nanoid';
import pino from 'pino';
import pinoHttp from 'pino-http';

import env from '@/lib/env';

const loggerTimestamp = () => {
  const currentTime = new Date(Date.now());

  return `,"timestamp":"${currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })} - ${currentTime.toLocaleDateString()}"`;
};

const productionLogger = pino({ level: 'info', timestamp: loggerTimestamp });
const developmentLogger = pino({
  level: 'debug',
  transport: {
    options: {
      colorize: true,
    },
    target: 'pino-pretty',
  },
  timestamp: loggerTimestamp,
});

const logger =
  env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export const httpLogger = pinoHttp({
  logger: logger,
  autoLogging: true,
  genReqId: (req) => {
    return req.headers['x-request-id'] || nanoid(); // Use client-provided ID if available
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    return 'info';
  },
  customSuccessMessage: (req, res, val) => {
    return `${req.method} ${req.url} | ${res.statusCode} | ${val}ms | id=${req.id}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} | ${res.statusCode} | ${err.message} | id=${req.id}`;
  },
  // wrapSerializers: true,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
      id: req.id, // If you use genReqId
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      responseTime: res.responseTime,
    }),
  },
});

export default logger;
