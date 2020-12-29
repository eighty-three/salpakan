import 'dotenv/config.js';

const config = {
  PORT: process.env.PORT,
  WS_PORT: process.env.WS_PORT,
  NODE_ENV: process.env.NODE_ENV as string,
  DB_CONNECTION: process.env.DB_CONNECTION,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PROJNAME: process.env.DB_PROJNAME,
  DB_PORT: process.env.DB_PORT,
  DB_HOSTNAME: process.env.DB_HOSTNAME,
  SECRET_JWT: process.env.SECRET_JWT as string,
  CLIENT_HOST: process.env.CLIENT_HOST as string
};

export default config;
