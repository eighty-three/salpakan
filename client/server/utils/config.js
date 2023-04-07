require('dotenv').config()

const config = {
  PORT: process.env.PORT,
  API_HOST: process.env.API_HOST,
  NODE_ENV: process.env.NODE_ENV,
  DB_CONNECTION: process.env.DB_CONNECTION,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PROJNAME: process.env.DB_PROJNAME,
  DB_PORT: process.env.DB_PORT
};

module.exports = config;
