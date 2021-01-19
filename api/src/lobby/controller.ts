import { RequestHandler } from 'express';
import * as lobby from './model';
import { nanoid } from 'nanoid';

export const getLobby: RequestHandler = async (req, res) => {
  const roomName = req.params.id as string;
  const check: string | null = await lobby.getLobby(roomName);

  if (check) {
    res.json({ message: 'Lobby found' });
  } else {
    res.json({ error: 'Lobby not found' });
  }
};

export const createLobby: RequestHandler = async (req, res) => {
  const roomName = nanoid(10);

  try {
    await lobby.createLobby(roomName);
    res.json({ roomName });
  } catch {
    res.json({ error: 'Something went wrong' });
  }
};
