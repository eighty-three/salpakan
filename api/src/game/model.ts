import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const startGame = async (
  gameStates: any,
  roomName: string,
  connections: string[]
): Promise<void> => {
  const arr = connections.slice();

  gameStates[roomName] = {
    playerList: arr,
    p1: {
      name: arr[0],
      board: null
    },
    p2: {
      name: arr[1],
      board: null
    },
    turn: arr[0],
    start: false,
    time: null
  };

  const query = new PS({ name: 'start-game', text: '\
    SELECT FROM games WHERE name=$1'
  });

  query.values= [ roomName, ...arr ];
  await db.none(query);
};

export const getGame = async (
  roomName: string
): Promise<any|null> => {
  const query = new PS({ name: 'get-game', text: '\
    SELECT FROM games WHERE name=$1'
  });

  query.values = [ roomName ];
  return await db.oneOrNone(query);
};
