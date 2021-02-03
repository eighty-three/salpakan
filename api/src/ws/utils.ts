import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');
export const decode = (buf: ArrayBuffer): string => decoder.write(Buffer.from(buf));

import { performance } from 'perf_hooks';
import { IGameStates, IRoom, TPlayer, ICount, IPlayer } from '../game/types';

/* There's apparently a 'Deep Partial' so I can just use that
 * and then refactor connections into `ICount` but I probably
 * don't need to go ham on the types
 */
type TPartialPlayers = { [K in TPlayer]: Pick<IPlayer, 'name' | 'time'> };
interface IGameInfo extends TPartialPlayers {
  winner: string | null;
  connections: string[];
}

/* Refactored into its own function because
 * these properties are the most queried
 */
export const getGameInfo = (room: IRoom): IGameInfo => {
  return {
    p1: {
      name: room.p1.name,
      time: room.p1.time
    },
    p2: {
      name: room.p2.name,
      time: room.p2.time
    },
    winner: room.winner,
    connections: room.connections.list
  };
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


export enum WS_RESPONSE_CODE {
  CONTINUE = 4000,
  GAME_NOT_FOUND,
  NOT_IN_LIST
}

interface IResponse {
  code: WS_RESPONSE_CODE,
  reason?: string
}

export const connectionHandler = (
  gameStates: IGameStates,
  roomName: string,
  user: string | undefined
): IResponse => {
  const response: IResponse = {
    code: WS_RESPONSE_CODE.CONTINUE
  };

  if (!gameStates[roomName]) {
    response.code = WS_RESPONSE_CODE.GAME_NOT_FOUND;
    response.reason= 'Game not found';
  } else if (!user || !gameStates[roomName].playerList.includes(user)) {
    response.code = WS_RESPONSE_CODE.NOT_IN_LIST;
    response.reason= 'The game is currently ongoing';
  }

  return response;
};
