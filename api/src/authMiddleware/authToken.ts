import { RequestHandler } from 'express';
import config from '@utils/config';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import * as token from '../auth/token';
import { IPayload } from '../auth/types';

export const verifyToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.cookie) {
    res.status(401).json({ error: 'You are not authenticated' });
    return;
  }

  const cookies = cookie.parse(req.headers.cookie);
  verify(cookies.access, config.SECRET_JWT,
    async (err, decoded: IPayload|undefined) => {
      if (err) {
        const refreshToken = await token.getRefreshToken(req);
        const check = await token.verifyRefreshToken(refreshToken);

        // if error, check if refreshToken is included and is legit
        if (!check) {
          res.clearCookie('refresh', { path: '/' });
          res.status(401).json({ error: 'You are not authenticated' });
        } else {
          if (refreshToken) {
            res.locals.username = refreshToken.username;
            res.locals.role = refreshToken.role;
            await token.setAccessToken(refreshToken, res);
          }
          next();
        }

        return;
      } else if (decoded) {
        res.locals.username = decoded.username;
        res.locals.role = decoded.role;
        next();
        return;
      }

      res.status(400).json({ error: 'Something went wrong' });
    }
  );
};

export const verifyRole = (roles: string[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      if (!req.headers.cookie) {
        res.status(401).json({ error: 'You are not authenticated' });
        return;
      }

      const cookies = cookie.parse(req.headers.cookie);
      verify(cookies.access, config.SECRET_JWT,
        async (err, decoded: IPayload|undefined) => {
          if (err) {
            const refreshToken = await token.getRefreshToken(req);
            const check = await token.verifyRefreshToken(refreshToken);

            // if error, check if refreshToken is included and is legit
            if (!check) {
              res.clearCookie('refresh', { path: '/' });
              res.status(401).json({ error: 'You are not authenticated' });
            } else {
              const role = refreshToken?.role as string;
              if (!roles.includes(role)) {
                res.status(401).json({ error: 'You are not authenticated' });
                return;
              }

              if (refreshToken) {
                res.locals.username = refreshToken.username;
                res.locals.role = refreshToken.role;
                await token.setAccessToken(refreshToken, res);
              }
              next();
            }

            return;
          } else if (decoded) {
            const role = decoded.role as string;
            if (!roles.includes(role)) {
              res.status(401).json({ error: 'You are not authenticated' });
              return;
            }

            res.locals.username = decoded.username;
            res.locals.role = decoded.role;
            next();
            return;
          }

          res.status(400).json({ error: 'Something went wrong' });
        }
      );
    } catch {
      res.status(400).json({ error: 'Something went wrong' });
    }
  };
};

export const verifyExistingToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.cookie) {
    next();
  } else {
    const cookies = cookie.parse(req.headers.cookie);
    verify(cookies.access, config.SECRET_JWT, async function (err, decoded: IPayload|undefined) {
      if (err) {
        const refreshToken = await token.getRefreshToken(req);
        const check = await token.verifyRefreshToken(refreshToken);

        if (!check) {
          res.clearCookie('refresh', { path: '/' });
          res.status(400).json({ error: 'Bad Request' });
        } else {
          if (refreshToken) await token.setAccessToken(refreshToken, res);
          res.status(400).json({ error: 'Already logged in' });
        }

        next();
      } else if (decoded) {
        if (decoded.guest) {
          next();
          return;
        }

        res.status(400).json({ error: 'Already logged in' });
      }
    });
  }
};

export const getUsername = async (reqCookie: string|null): Promise<string|void> => {
  if (!reqCookie) return;

  let username: string | undefined;
  const cookies = cookie.parse(reqCookie);

  verify(cookies.access, config.SECRET_JWT, async function (err, decoded: IPayload|undefined) {
    if (err) {
      let refreshToken = null;
      verify(cookies.refresh, config.SECRET_JWT,
        async (err, decoded: IPayload|undefined) => {
          if (err) {
            refreshToken = null;
          } else if (decoded) {
            refreshToken = decoded;
            username = decoded.username;
          }

          refreshToken = null;
        }
      );

      const check = await token.verifyRefreshToken(refreshToken);
      if (!check) {
        username = undefined;
      }
    } else if (decoded) {
      username = decoded.username as string;
    }
  });

  return username;
};
