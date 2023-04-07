const withPreact = require('next-plugin-preact');

module.exports = withPreact({
  env: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    WS_PORT: process.env.WS_PORT,
    SECRET: process.env.SECRET
  },
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
});
