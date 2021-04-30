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
        board: {
          ...gameState.winner_board,
          ...gameState.loser_board
        },
        p1: { name: gameState.player1 },
        p2: { name: gameState.player2 },
        winner: gameState.winner,
        positionHistory: gameState.position_history
      });
    }
  } else {
    res.json({ error: 'Game not found' });
  }
};
