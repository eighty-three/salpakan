const withPreact = require('next-plugin-preact');

module.exports = withPreact({
  env: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    WS_PORT: process.env.WS_PORT,
    SECRET: process.env.SECRET
  },
  trailingSlash: true
});
