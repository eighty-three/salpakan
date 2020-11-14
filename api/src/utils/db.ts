import config from '../utils/config';
import pgp from 'pg-promise';

const pg = pgp();
const cn = `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@localhost:${config.DB_PORT}/${config.DB_PROJNAME}`;
const db = pg(cn);

export default db;