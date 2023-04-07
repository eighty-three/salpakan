import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

import { IName } from './types';

export const createLobby = async (
  roomName: string,
): Promise<void> => {
  const query = new PS({ name: 'create-lobby', text: '\
    INSERT INTO lobbies (name, expiry) VALUES ($1, $2)'
  });

  const expiry = Math.floor(Date.now() / 1000) + 600; // 10 minutes

  query.values = [roomName, expiry];
  await db.none(query);
};

export const getLobby = async (
  roomName: string,
): Promise<string|null> => {
  const query = new PS({ name: 'get-lobby', text: '\
    SELECT name FROM lobbies WHERE name=$1 AND expiry > $2'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [roomName, currentTime];
  return await db.oneOrNone(query);
};

export const deleteLobby = async (
  roomName: string,
): Promise<void> => {
  const query = new PS({ name: 'delete-lobby', text: '\
    DELETE FROM lobbies WHERE name=$1'
  });

  query.values = [roomName];
  await db.none(query);
};

export const deleteLobbies = async (): Promise<IName[]|null> => {
  const query = new PS({ name: 'delete-lobbies', text: '\
    DELETE FROM lobbies WHERE expiry < $1 RETURNING name'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [currentTime];
  return await db.manyOrNone(query);
};
