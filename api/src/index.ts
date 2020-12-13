import http from 'http';
import config from './utils/config';
import logger from './utils/logger';
import app from './app';
import wsApp from './ws';

const server = http.createServer();

server.on('request', app);

server.listen(process.env.PORT, function() {
  logger.info(`http/ws server listening on ${config.PORT}`);
});

wsApp.listen(8500, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 3000');
  }
});
