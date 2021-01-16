import { RequestHandler } from 'express';
import config from '@utils/config';

import * as argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { nanoid } from 'nanoid';

import { createAccount } from './model';

export const login: RequestHandler = async (req, res) => {
  const { username } = req.body;

  const claims = { username };
  const authToken = sign(claims, config.SECRET_JWT, { expiresIn: '1y' });

  res.setHeader('Set-Cookie', cookie.serialize('auth', authToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 31536000,
    path: '/'
  }));

  res.status(200).json({ message: 'Cookie set' });
};

export const signup: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  const hash = await argon2.hash(password);
  await createAccount(username, hash);

  const claims = { username };
  const authToken = sign(claims, config.SECRET_JWT, { expiresIn: '1y' });

  res.setHeader('Set-Cookie', cookie.serialize('auth', authToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 31536000,
    path: '/'
  }));

  res.status(200).json({ message: 'Cookie set' });
};

export const logout: RequestHandler = async (req, res) => {
  const { message } = req.body;
  res.clearCookie('auth', { path: '/' });
  res.status(200).json({ message });
};

export const getCookie: RequestHandler = async (req, res) => {
  const claims = { username: `c=${nanoid(15)}` };

  const authToken = sign(claims, config.SECRET_JWT, { expiresIn: '1y' });
  res.setHeader('Set-Cookie', cookie.serialize('auth', authToken, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 31536000,
    path: '/',
  }));

  res.status(200).json({ message: 'Cookie set' });
};
