import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890ABCDEFGH', 5);

import { IGameStates, IGame, IBoard, IName } from './types';
import { getInitialBoardState, player2Board } from './utils';
import { randomizeBoard } from './bot';

export const startGame = async (
  gameStates: IGameStates,
  roomName: string,
  connections: string[],
  bot?: boolean
): Promise<void> => {
  const arr = connections.slice();

  /* Multiple checks for if bot game
   *
   * p2.board initializes a randomized board state
   * p2.start is set to true immediately
   * The `bot` key is to explicitly state that it's a bot game
   */

  // deciseconds used for all time values in gameStates
  gameStates[roomName] = {
    playerList: arr,
    p1: {
      name: arr[0],
      board: getInitialBoardState('p1'),
      time: 6000, // 10 minutes
      start: false,
      pin: nanoid()
    },
    p2: {
      name: arr[1],
      board: (!bot) ? getInitialBoardState('p2') : randomizeBoard('p2', player2Board),
      time: 6000,
      start: (!bot) ? false : true,
      pin: nanoid()
    },
    board: {},
    turn: 'p1',
    start: false,
    lastMove: 0,
    winner: null,
    time: Math.floor(Date.now() / 100) + 1200, // 2 minutes setup time
    connections: { list: [], lastPublished: 0 },
    spectators: {},
    bot: !!bot,
    positionHistory: []
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
    SELECT winner_board, loser_board, player1, player2, ongoing, winner, position_history \
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
  winner: string,
  positionHistory: string[]
): Promise<void> => {
  const query = new PS({ name: 'store-game', text: '\
    UPDATE games SET \
      winner_board=$2, loser_board=$3, ongoing=$4, winner=$5, position_history=$6 \
    WHERE name=$1'
  });

  query.values = [roomName, winnerBoard, loserBoard, false, winner, positionHistory];
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
