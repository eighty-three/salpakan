import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import { authToken } from '@authMiddleware/index';

import * as MM from './controller';
import * as MMSchema from './schema';


router.post('/find',
  validator(MMSchema.findGame, 'body'),
  authToken.verifyToken,
  MM.addToPool,
  MM.findGame,
);

export default router;
