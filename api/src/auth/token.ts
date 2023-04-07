import { RequestHandler, Request, Response } from 'express';
import config from '@utils/config';
import { verify, sign } from 'jsonwebtoken';
import cookie from 'cookie';
import * as auth from '../auth/model';
import { IPayload } from './types';
import { MAX_COOKIE_AGE, MAX_TOKEN_AGE } from './constants';

export const getRefreshToken = async (
  req: Request
): Promise<IPayload|null> => {
  try {
    if (!req.headers.cookie) return null;

    const cookies = cookie.parse(req.headers.cookie);
    let decodedToken = null;
    verify(cookies.refresh, config.SECRET_JWT,
      async (err, decoded: IPayload|undefined) => {
        if (err) {
          decodedToken = null;
          return;
        } else if (decoded) {
          decodedToken = decoded;
          return;
        }

        decodedToken = null;
        return;
      }
    );
    return decodedToken;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (
  token: IPayload|null
): Promise<boolean> => {
  if (!token) {
    return false;
  } else {
    const { username, session } = token;
    const { session: latestSession } = await auth.getSession(username as string);
    return (session === latestSession);
  }
};

export const refreshAccessToken: RequestHandler = async (req, res) => {
  try {
    const decodedToken = await getRefreshToken(req);
    if (!decodedToken) {
      res.status(401).json({ error: 'You are not authenticated' });
      return;
    }

    const accessToken = await setAccessToken(decodedToken, res);
    res.status(200).json({ token: accessToken });
  } catch {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const setAccessToken = async (
  refreshToken: IPayload,
  res: Response
): Promise<string> => {
  const { username, role } = refreshToken;
  const expiresIn = (role === 'guest') ? MAX_TOKEN_AGE : 60 * 60;

  const accessToken = sign({ username, role }, config.SECRET_JWT, { expiresIn });
  res.cookie('access', accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: MAX_COOKIE_AGE,
    path: '/'
  });

  return accessToken;
};
