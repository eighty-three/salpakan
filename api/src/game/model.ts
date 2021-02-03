import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';
import { IGameStates, IGame, IBoard, IName } from './types';
import { getInitialBoardState } from './utils';

export const startGame = async (
  gameStates: IGameStates,
  roomName: string,
  connections: string[]
): Promise<void> => {
  const arr = connections.slice();

  // deciseconds used for all time values in gameStates
  gameStates[roomName] = {
    playerList: arr,
    p1: {
      name: arr[0],
      board: getInitialBoardState('p1'),
      time: 6000, // 10 minutes
      start: false
    },
    p2: {
      name: arr[1],
      board: getInitialBoardState('p2'),
      time: 6000,
      start: false
    },
    board: {},
    turn: 'p1',
    start: false,
    lastMove: 0,
    winner: null,
    time: Math.floor(Date.now() / 100) + 1200, // 2 minutes setup time
    connections: { list: [], lastPublished: 0 }
  };

  const expiry = Math.floor(Date.now() / 1000) + 7200; // 2 hours till game expire

  const query = new PS({ name: 'start-game', text: '\
    INSERT INTO games (name, player1, player2, expiry) VALUES ($1, $2, $3, $4)'
  });

  query.values= [roomName, ...arr, expiry];
  await db.none(query);
};

export const getGame = async (
  roomName: string
): Promise<IGame|null> => {
  const query = new PS({ name: 'get-game', text: '\
    SELECT winner_board, loser_board, player1, player2, ongoing, winner \
    FROM games WHERE name=$1 AND expiry > $2'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [roomName, currentTime];
  return await db.oneOrNone(query);
};

export const storeGame = async (
  roomName: string,
  winnerBoard: IBoard,
  loserBoard: IBoard,
  winner: string
): Promise<void> => {
  const query = new PS({ name: 'store-game', text: '\
    UPDATE games SET \
      winner_board=$2, loser_board=$3, ongoing=$4, winner=$5 \
    WHERE name=$1'
  });

  query.values = [roomName, winnerBoard, loserBoard, false, winner];
  await db.none(query);
};

export const deleteGame = async (
  roomName: string
): Promise<void> => {
  const query = new PS({ name: 'delete-game', text: '\
    DELETE FROM games WHERE name=$1'
  });

  query.values = [roomName];
  await db.none(query);
};

export const deleteGames = async (): Promise<IName[]|null> => {
  const query = new PS({ name: 'delete-games', text: '\
    DELETE FROM games WHERE expiry < $1 RETURNING name'
  });

  const currentTime = Math.floor(Date.now() / 1000);

  query.values = [currentTime];
  return await db.manyOrNone(query);
};
