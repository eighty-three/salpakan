import { RequestHandler } from 'express';
import shortid from 'shortid';
import * as match from './model';
import * as errors from 'utils/error';
import {getLoggerInstance} from '@utils/logger';


const logger = getLoggerInstance();
export const addToPool: RequestHandler = async (req, res, next) => {
  //TODO: get socket id from params, and pass that instead of username
  const playerAdded = await match.addToPlayerPool('replace_me_with_socket_id');
  if (!playerAdded) {
    logger.info('Internal server error occurred: adding to player pool');
    res.status(500).json({error: 'Internal server error'});
    return;
  }

  next();
  return;
};

export const findGame: RequestHandler = async (req, res, next) => {
  const url = shortid.generate().substr(0, 10);
  const playerList = await match.getPlayerPooList();
  if (playerList.type === errors.ERROR) {

  }
};
