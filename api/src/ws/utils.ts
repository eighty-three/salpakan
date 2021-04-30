import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');
export const decode = (buf: ArrayBuffer): string => decoder.write(Buffer.from(buf));

import { performance } from 'perf_hooks';
import { nanoid } from 'nanoid';
import { removeUnknownValues } from '../game/utils';
import { storeGame } from '../game/model';

import { IGameStates, IRoom, TPlayer, ICount } from '../game/types';
import { IGameInfo, IResponse, WS_RESPONSE_CODE, IHandshake } from './types';

/* Refactored into its own function because
 * these properties are the most queried
 */
export const getGameInfo = (room: IRoom, player?: TPlayer|null): IGameInfo => {
  return {
    p1: {
      name: room.p1.name,
      time: room.p1.time,
      pin: (player && player === 'p1') ? room.p1.pin : null
    },
    p2: {
      name: room.p2.name,
      time: room.p2.time,
      pin: (player && player === 'p2') ? room.p2.pin : null
    },
    winner: room.winner,
    connections: room.connections.list,
    bot: room.bot
  };
};

export const declareWinner = async (
  gameStates: IGameStates,
  roomName: string,
  winner: string
): Promise<void> => {
  const room = gameStates[roomName];
  const { winnerBoard, loserBoard } = (winner === room.p1.name) ? {
    winnerBoard: room.p1.board,
    loserBoard: room.p2.board
  } : {
    winnerBoard: room.p2.board,
    loserBoard: room.p1.board
  };

  const { fixedWinnerBoard, fixedLoserBoard } = removeUnknownValues(winnerBoard, loserBoard);
  gameStates[roomName].board = { ...fixedWinnerBoard, ...fixedLoserBoard };

  await storeGame(roomName, fixedWinnerBoard, fixedLoserBoard, winner, room.positionHistory);
};

export const refreshTime = (room: IRoom, player: TPlayer): void => {
  const currentTime = performance.now() / 100;
  const elapsedTime = currentTime - room.lastMove;

  /* Update the player's time by deducting from it the
   * amount of time that has passed since the last move
   *
   * `lastMove` is used as the key name but the function
   * also gets called on other events such as socket open
   * or socket close.
   */
  room[player].time = room[player].time - elapsedTime;
  room.lastMove = performance.now() / 100;

  /* If the player's time has ran out, set
   * the player's opponent as the winner
   */
  if (room[player].time <= 0) {
    const opponent = (player === 'p1') ? 'p2' : 'p1';
    room.winner = room[opponent].name;
  }
};

export const refreshPublishTime = (
  count: ICount,
  threshold: number,
  forceRefresh?: boolean
): boolean => {
  const currentTime = performance.now();
  const elapsedTime = currentTime - count.lastPublished;

  // Sets to current time, called on socket open
  if (forceRefresh) {
    count.lastPublished = currentTime;
    return true;
  }

  // Publish count only every x seconds
  if (elapsedTime > threshold) {
    count.lastPublished = currentTime;
    return true;
  }

  return false;
};

export const connectionHandler = (
  gameStates: IGameStates,
  roomName: string,
  user: string | undefined
): IResponse => {
  const response: IResponse = { code: WS_RESPONSE_CODE.CONTINUE };
  const inList = user || nanoid(20); // Random string if null

  if (!gameStates[roomName]) {
    response.code = WS_RESPONSE_CODE.GAME_NOT_FOUND;
    response.reason = 'Game not found';
  } else if (
    /* If the game is still in its setup phase and
     * the user isn't among the players
     */
    !gameStates[roomName].start
    && !gameStates[roomName].playerList.includes(inList)
  ) {
    response.code = WS_RESPONSE_CODE.IN_SETUP;
    response.reason = 'The game is currently in setup phase';
  }

  return response;
};

export const handshakeHandler = (
  passedData: { [key: string]: any },
  checks: boolean[],
  handshake: IHandshake
): void => {
  const { req, res, context } = handshake;
  const upgradeAborted = { aborted: false };

  const check = checks.reduce((a, b) => (b) ? a : false, true);

  if (check) {
    res.upgrade(
      passedData,
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
      context
    );
  } else {
    res.onAborted(() => { upgradeAborted.aborted = true; });
    res.writeStatus('400 Bad Request');
    res.end();
  }
};
