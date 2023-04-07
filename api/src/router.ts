import express from 'express';
const router = express.Router();

// Routes
import accountRouter from './account/router';
router.use('/account', accountRouter);

import authRouter from './auth/router';
router.use('/auth', authRouter);

import gameRouter from './game/router';
router.use('/game', gameRouter);

import lobbyRouter from './lobby/router';
router.use('/lobby', lobbyRouter);

import botRouter from './bot/router';
router.use('/bot', botRouter);

export default router;
