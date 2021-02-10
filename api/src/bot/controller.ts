import { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

import { gameStates } from '../ws';
import { startGame } from '../game/model';
import { getUsername } from '../authMiddleware/authToken';

export const createBotGame: RequestHandler = async (req, res) => {
  try {
    const roomName = nanoid(10);

    /* "as string" shouldn't be necessary because of the verifyCookie
     * middleware that would prevent the request from getting to the
     * controller if there is no cookie.
     */
    const username  = await getUsername(req.headers.cookie as string);
    const connections = [username as string, 'Mr. Bot'];
    await startGame(gameStates, roomName, connections, true);

    res.json({ roomName });
  } catch (err) {
    res.json({ error: 'Something went wrong' });
  }
};
