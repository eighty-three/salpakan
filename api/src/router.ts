import express from 'express';
const router = express.Router();

// Middleware
import { authToken, authAccount } from '@authMiddleware/index';
router.post('/verify', authToken.verifyToken, authAccount.verifyUser);


// Routes
import accountRouter from './account/router';
router.use('/account', accountRouter);

import MMRouter from './matchmaking/router';
router.use('/match', MMRouter);

export default router;
