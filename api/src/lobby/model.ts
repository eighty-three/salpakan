import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const createLobby = async (
  roomName: string,
): Promise<void> => {
  const query = new PS({ name: 'create-lobby', text: '\
    INSERT INTO lobbies (name) VALUES ($1)'
  });

  query.values = [ roomName ];
  await db.none(query);
};

export const deleteLobby = async (
  roomName: string,
): Promise<void> => {
  const query = new PS({ name: 'delete-lobby', text: '\
    DELETE FROM lobbies WHERE name=$1'
  });

  query.values = [ roomName ];
  await db.none(query);
};

export const getLobby = async (
  roomName: string,
): Promise<string|null> => {
  const query = new PS({ name: 'get-lobby', text: '\
    SELECT name FROM lobbies WHERE name=$1'
  });

  query.values = [ roomName ];
  return await db.oneOrNone(query);
};
