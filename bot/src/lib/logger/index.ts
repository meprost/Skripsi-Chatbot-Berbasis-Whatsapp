import pino from 'pino';

import env from '../env';

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

export default logger;
