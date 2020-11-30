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

  const expiry = Math.floor(Date.now() / 1000) + 7200;

  const query = new PS({ name: 'start-game', text: '\
    INSERT INTO games (name, player1, player2, expiry) VALUES ($1, $2, $3, $4)'
  });

  query.values= [ roomName, ...arr, expiry ];
  await db.none(query);
};

export const getGame = async (
  roomName: string
): Promise<any|null> => {
  const query = new PS({ name: 'get-game', text: '\
    SELECT * FROM games WHERE name=$1 AND expiry > $2'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [ roomName, currentTime ];
  return await db.oneOrNone(query);
};

export const storeGame = async (
  roomName: string,
  player1_state: string, // Stringified JSON
  player2_state: string
): Promise<void> => {
  const query = new PS({ name: 'store-game', text: '\
    UPDATE games SET \
      ongoing=$4, player1_state=$2, player2_state=$3, \
    WHERE name=$1'
  });

  query.values = [ roomName, player1_state, player2_state, false ];
  await db.none(query);
};

export const deleteGames = async (): Promise<void> => {
  const query = new PS({ name: 'delete-games', text: '\
    DELETE FROM games WHERE expiry < $1'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [ currentTime ];
  await db.none(query);
};
