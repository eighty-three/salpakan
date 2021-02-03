import { RequestHandler } from 'express';
import * as account from './accountModel';
import * as argon2 from 'argon2';

export const verifyUser: RequestHandler = async (req, res) => {
  const { username } = req.body;

  const user = await account.checkUsername(username);
  if (!user) {
    res.status(409).json({ error: 'Username not found' });
    return;
  }

  res.status(200).json({ username });
};

export const checkExistingUsername: RequestHandler = async (req, res, next) => {
  const { username } = req.body;

  const user = await account.checkUsername(username);
  if (!user) {
    next();
    return;
  } else {
    res.status(409).json({ error: 'Username already taken' });
  }
};

export const checkPassword: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await account.checkPassword(username);
  if (!user) {
    res.status(401).json({ error: 'Username not found' });
    return;
  }

  const hash = user.password;
  if (await argon2.verify(hash, password)) {
    next();
    return;
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
};

export const replaceExistingUsername: RequestHandler = async (req, res, next) => {
  const { newUsername } = req.body;

  const user = await account.checkUsername(newUsername);
  if (!user) {
    next();
    return;
  } else {
    res.status(409).json({ error: 'Username already taken' });
  }
};

export const checkIfUsernameExists: RequestHandler = async (req, res, next) => {
  const { username } = req.body;

  const user = await account.checkUsername(username);
  if (!user) {
    res.status(401).json({ error: 'Username not found' });
    return;
  }

  next();
  return;
};
