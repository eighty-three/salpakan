import express from 'express';
const router = express.Router();

import { authToken } from '@authMiddleware/index';

import * as bot from './controller';

router.get('/create',
  authToken.verifyCookie,
  bot.createBotGame
);

export default router;
