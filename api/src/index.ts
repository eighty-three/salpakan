import http from 'http';
import config from './utils/config';
import app from './app';
import {getLoggerInstance} from '@utils/logger';

const server = http.createServer(app);
const logger = getLoggerInstance();

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
