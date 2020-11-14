import { RequestHandler } from 'express';
import shortid from 'shortid';
import * as content from './model';

export const findPublicLobby: RequestHandler = async (req, res) => {
  const url = shortid.generate().substr(0, 10);
  res.json(url);
};
