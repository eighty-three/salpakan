import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import { authToken, authAccount } from '@authMiddleware/index';

import * as account from './controller';
import * as accountSchema from './schema';


router.post('/changePassword',
  validator(accountSchema.changePassword, 'body'),
  authToken.verifyToken,
  authAccount.checkPassword,
  account.changePassword
);

export default router;
