import express from 'express';
const router = express.Router();

// Middleware
import { authToken, authAccount } from '@authMiddleware/index';
import Joi from '@hapi/joi';
import validator from '@utils/validator';

const username = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9_]{1,29}$/).required(),
});

router.post('/verify',
  validator(username, 'body'),
  authToken.verifyToken,
  authAccount.verifyUser
);


// Routes
import accountRouter from './account/router';
router.use('/account', accountRouter);

import gameRouter from './game/router';
router.use('/game', gameRouter);

import lobbyRouter from './lobby/router';
router.use('/lobby', lobbyRouter);

export default router;
