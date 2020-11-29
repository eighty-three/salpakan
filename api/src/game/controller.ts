import { RequestHandler } from 'express';
import * as game from './model';

export const getGame: RequestHandler = async (req, res) => {
  const roomName = req.query.id as string;
  const gameState: any = await game.getGame(roomName);

  if (!gameState) {
    res.json({ error: 'Game not found' });
  } else if (gameState.ongoing) {
    res.json({ ongoing: true });
  } else {
    res.json({
      state: gameState.state,
      player1: gameState.player1,
      player2: gameState.player2
    });
  }
};
