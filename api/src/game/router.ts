import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import * as game from './controller';
import * as gameSchema from './schema';

router.get('/:id',
  validator(gameSchema.getGame, 'params'),
  game.getGame
);

export default router;
