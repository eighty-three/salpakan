// Express
const express = require('express');
const cors = require('cors');

// Utils
const config = require('./utils/config');
const middleware = require('./utils/middleware');

// Proxy for API
const { createProxyMiddleware } = require('http-proxy-middleware');

// Next
const next = require('next');
const dev = config.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // Proxy for API
  if (config.NODE_ENV !== 'production') {
    app.use('/api', createProxyMiddleware({ target: config.API_HOST, changeOrigin: true }));
  }
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(middleware.requestLogger);

  // Next Routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Error handler
  app.use(middleware.unknownEndpoint);
  app.use(middleware.errorHandler);

  app.listen(config.PORT, () => {
    console.log(`> Ready on http://localhost:${config.PORT}`);
  });
});
