import { RequestHandler } from 'express';
import * as game from './model';
import { IGame } from './types';

export const getGame: RequestHandler = async (req, res) => {
  const roomName = req.params.id as string;
  const gameState: IGame | null = await game.getGame(roomName);

  if (gameState) {
    if (gameState.ongoing) {
      res.json({ ongoing: true });
    } else {
      res.json({
        gameState: {
          player1_state: gameState.player1_state,
          player2_state: gameState.player2_state,
        }, // Should be merged
        p1: { name: gameState.player1 },
        p2: { name: gameState.player2 },
        winner: gameState.winner
      });
    }
  } else {
    res.json({ error: 'Game not found' });
  }
};
