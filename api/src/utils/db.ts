import config from '../utils/config';
import pgp from 'pg-promise';
import logger from '@utils/logger';

const pg = pgp();
const cn = `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOSTNAME}:${config.DB_PORT}/${config.DB_PROJNAME}`;
const db = pg(cn);

// tests connection and prints out Postgres server version,
// if successful; or else rejects with connection error:
(async () => {
  let dbConnection;
  try {
    dbConnection = await db.connect();
    logger.info(`successfully connected to postgres database ${config.DB_PROJNAME}.
    server version: ${dbConnection.client.serverVersion}
    port: ${config.PORT} host: ${config.DB_HOSTNAME}.`);
  } catch (err) {
    logger.error(`error connecting to postgres database ${config.DB_PROJNAME} error: ${err}`)
  } finally {
    if (dbConnection) {
      dbConnection.done();
    }
  }
})();

export default db;