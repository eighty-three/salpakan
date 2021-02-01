import { performance } from 'perf_hooks';
import { StringDecoder } from 'string_decoder';

import { IRoom, TPlayer } from '../game/types';
import { ICount } from '../game/types';

const decoder = new StringDecoder('utf8');

export const decode = (buf: ArrayBuffer): string => decoder.write(Buffer.from(buf));

export const refreshTime = (room: IRoom, player: TPlayer): void => {
  const currentTime = performance.now() / 100;
  const elapsedTime = currentTime - room.lastMove;
  room[player].time = room[player].time - elapsedTime;
  room.lastMove = performance.now() / 100;

  if (room[player].time <= 0) {
    const opponent = (player === 'p1') ? 'p2' : 'p1';
    room.winner = room[opponent].name;
  }
};

export const getGameInfo = (room: IRoom) => {
  return {
    p1: {
      name: room.p1.name,
      time: room.p1.time
    },
    p2: {
      name: room.p2.name,
      time: room.p2.time
    },
    winner: room.winner
  };
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
