import { RequestHandler } from 'express';
import * as account from './accountModel';
import * as argon2 from 'argon2';

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
