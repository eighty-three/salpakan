import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import { authToken, authAccount } from '@authMiddleware/index';

import * as auth from './controller';
import * as token from './token';
import * as authSchema from './schema';


router.post('/login',
  validator(authSchema.login, 'body'),
  authToken.verifyExistingToken,
  authAccount.checkPassword,
  auth.login
);

router.post('/signup',
  validator(authSchema.signup, 'body'),
  authToken.verifyExistingToken,
  auth.signup
);

router.post('/logout',
  validator(authSchema.logout, 'body'),
  auth.logout
);

router.get('/token',
  authToken.verifyToken,
  token.refreshAccessToken
);

router.get('/cookie',
  authToken.verifyExistingToken,
  auth.getGuestCookie
);

export default router;
