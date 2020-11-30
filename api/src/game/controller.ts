import { RequestHandler } from 'express';
import * as game from './model';

export const getGame: RequestHandler = async (req, res) => {
  const roomName = req.params.id as string;
  const gameState: any = await game.getGame(roomName);

  if (gameState?.ongoing) {
    res.json({ ongoing: true });
  } else if (gameState) {
    res.json({
      player1_state: gameState.player1_state,
      player2_state: gameState.player2_state,
      player1: gameState.player1,
      player2: gameState.player2
    });
  } else {
    res.json({ error: 'Game not found' });
  }
};
