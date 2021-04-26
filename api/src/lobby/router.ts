import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import { authToken } from '@authMiddleware/index';

import * as lobby from './controller';
import * as lobbySchema from './schema';

router.get('/create',
  authToken.verifyToken,
  lobby.createLobby
);

router.get('/:id',
  validator(lobbySchema.getLobby, 'params'),
  lobby.getLobby
);

export default router;
