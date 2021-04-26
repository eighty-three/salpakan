import { RequestHandler } from 'express';
import config from '@utils/config';
import * as argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import * as account from '../account/model';
import * as auth from './model';
import { MAX_COOKIE_AGE, MAX_TOKEN_AGE } from './constants';

export const login: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;
    const { session, role } = await auth.getSession(username);

    const accessToken = sign(
      { username, role },
      config.SECRET_JWT,
      { expiresIn: 60 * 60 } // 1 hour
    );

    res.cookie('access', accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: MAX_COOKIE_AGE,
      path: '/'
    });

    const refreshToken = sign(
      { username, role, session },
      config.SECRET_JWT,
      { expiresIn: MAX_TOKEN_AGE } // No expiration for refresh token
    );

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: MAX_COOKIE_AGE,
      path: '/'
    });

    res.status(200).json({ message: 'Cookie set' });
  } catch {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const signup: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await argon2.hash(password);
    const session = nanoid(20);
    const role = 'user';
    await account.createAccount(username, hash, session, role);

    const accessToken = sign(
      { username, role },
      config.SECRET_JWT,
      { expiresIn: 60 * 60 } // 1 hour
    );

    res.cookie('access', accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: MAX_COOKIE_AGE,
      path: '/'
    });

    const refreshToken = sign(
      { username, role, session },
      config.SECRET_JWT,
      { expiresIn: MAX_TOKEN_AGE } // No expiration for refresh token
    );

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: MAX_COOKIE_AGE,
      path: '/'
    });

    res.status(200).json({ message: 'Cookie set' });
  } catch (err) {
    if (err.message === 'duplicate key value violates unique constraint "accounts_username_key"') {
      res.status(409).json({ error: 'Username already taken' });
    } else {
      res.status(400).json({ error: 'Something went wrong' });
    }
  }
};

export const logout: RequestHandler = async (req, res) => {
  const { message } = req.body;
  res.clearCookie('access', { path: '/' });
  res.clearCookie('refresh', { path: '/' });
  res.status(200).json({ message });
};

export const getGuestCookie: RequestHandler = async (req, res) => {
  const username = `c=${nanoid(15)}`;
  const role = 'guest';
  const session = 'c=guest';

  const accessToken = sign(
    { username, role, guest: true },
    config.SECRET_JWT,
    { expiresIn: MAX_TOKEN_AGE } // Anonymous token doesn't have to expire
  );

  res.cookie('access', accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: MAX_COOKIE_AGE,
    path: '/'
  });

  const refreshToken = sign(
    { username: 'c=guest', role, session },
    config.SECRET_JWT,
    { expiresIn: MAX_TOKEN_AGE }
  );

  res.cookie('refresh', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: MAX_COOKIE_AGE,
    path: '/'
  });

  res.status(200).json({ message: 'Cookie set' });
};
