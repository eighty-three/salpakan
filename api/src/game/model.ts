import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const startGame = (
  gameStates: any,
  roomName: string,
  connections: string[]
): void => {
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

  //const data = [ roomName, arr ];
  //sendToDatabase(data);
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
