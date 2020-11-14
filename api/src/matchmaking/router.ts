import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import { authToken } from '@authMiddleware/index';

import * as MM from './controller';
import * as MMSchema from './schema';


router.post('/find',
  validator(MMSchema.findPublicLobby, 'body'),
  authToken.verifyToken,
  MM.findPublicLobby
);

export default router;
