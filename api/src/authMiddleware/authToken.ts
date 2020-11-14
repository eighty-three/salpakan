import { RequestHandler } from 'express';
import config from '@utils/config';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

import * as account from './accountModel';

interface IPayload {
  username?: string;
  iat?: number;
  exp?: number;
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.cookie) {
    res.status(401).json({ error: 'You are not authenticated' });
    return;
  }

  const cookies = cookie.parse(req.headers.cookie);
  verify(cookies.auth, config.SECRET_JWT, async function (err, decoded: IPayload|undefined) {
    if (err && !decoded) {
      res.status(401).json({ error: 'You are not authenticated' });
      return;
    } else if (decoded) {
      const username = decoded.username as string;
      const user = await account.checkUsername(username);
      if (!user) {
        res.status(401).json({error: 'You are not authenticated'});
        return;
      }
    }
  });
  next();
  return;
};

export const verifyExistingToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.cookie) {
    next();
    return;
  } else {
    const cookies = cookie.parse(req.headers.cookie);
    verify(cookies.auth, config.SECRET_JWT, async function (err, decoded) {
      if (err && !decoded) {
        next();
        return;
      }
    });
  }

  res.status(400).json({ error: 'Already logged in' });
};
