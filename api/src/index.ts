import http from 'http';
import config from './utils/config';
import logger from './utils/logger';
import app from './app';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
