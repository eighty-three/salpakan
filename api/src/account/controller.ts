import { RequestHandler } from 'express';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import * as account from './model';
import * as auth from '../auth/model';

export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const hash = await argon2.hash(newPassword);
    await account.changePassword(username, hash);
    await auth.setSession(username, nanoid(20));
    res.status(200).json({ message: 'Password successfully changed' });
  } catch {
    res.status(400).json({ error: 'Something went wrong' });
  }
};
