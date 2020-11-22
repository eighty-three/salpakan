import 'dotenv/config.js';

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV as string,
  DB_CONNECTION: process.env.DB_CONNECTION,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PROJNAME: process.env.DB_PROJNAME,
  DB_PORT: process.env.DB_PORT,
  SECRET_JWT: process.env.SECRET_JWT as string,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PLAYER_POOL_LIST: process.env.REDIS_PLAYER_POOL_LIST ? "player_pool" : process.env.REDIS_PLAYER_POOL_LIST as string,
};

export default config;
