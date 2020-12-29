import config from '../utils/config';
import pgp from 'pg-promise';
import logger from '@utils/logger';

const pg = pgp();
const cn = `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOSTNAME}:${config.DB_PORT}/${config.DB_PROJNAME}`;
const db = pg(cn);

// tests connection and returns Postgres server version,
// if successful; or else rejects with connection error:
let dbConnection: any;
db.connect()
.then(obj => {
  dbConnection = obj;
  logger.info(`successfully connected to postgres database ${config.DB_PROJNAME}.
  server version: ${dbConnection.client.serverVersion}
  port: ${config.PORT} host: ${config.DB_HOSTNAME}.`);
}).catch(error => {
  logger.error(`error connecting to postgres database ${config.DB_PROJNAME} error: ${error}`)
}).finally(()=> {
  // release the connection, if it was successful:
  if (dbConnection) {
    // if you pass `true` into method done, i.e. done(true),
    // it will make the pool kill the physical connection.
    dbConnection.done();
  }
});

export default db;