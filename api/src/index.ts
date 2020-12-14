import http from 'http';
import config from './utils/config';
import logger from './utils/logger';
import app from './app';
import wsApp from './ws';

const server = http.createServer();

server.on('request', app);

server.listen(config.PORT, () => {
  logger.info(`http server listening on PORT ${config.PORT}`);
});

wsApp.listen(Number(config.WS_PORT), (listenSocket) => {
  if (listenSocket) {
    logger.info(`ws server listening on PORT ${config.WS_PORT}`);
  }
});
