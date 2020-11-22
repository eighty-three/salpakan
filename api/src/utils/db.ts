import config from '../utils/config';
import pgp from 'pg-promise';
import * as redis from 'redis';

const pg = pgp();
const cn = `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@localhost:${config.DB_PORT}/${config.DB_PROJNAME}`;
export const db = pg(cn);

export const PLAYER_POOL_LIST_NAME = config.REDIS_PLAYER_POOL_LIST
export const redisClient = redis.createClient(parseInt(config.REDIS_PORT!));
