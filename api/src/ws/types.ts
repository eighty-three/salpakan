import {
  HttpResponse,
  HttpRequest,
  us_listen_socket,
  WebSocket
} from 'uWebSockets.js';

// WebSocket methods
export interface IUpgrade<T> {
  (
    res: HttpResponse,
    req: HttpRequest,
    context: us_listen_socket
  ): T
}

export interface IOpen<T> {
  (socket: WebSocket): T
}
export interface IClose<T> {
  (socket: WebSocket): T
}

export interface IMessage<T> {
  (
    socket: WebSocket,
    message: ArrayBuffer
  ): T
}


import { TPlayer, IPlayer } from '../game/types';

type TPartialPlayers = { [K in TPlayer]: Pick<IPlayer, 'name' | 'time' | 'pin'> };
export interface IGameInfo extends TPartialPlayers {
  winner: string | null;
  connections: string[];
  bot: boolean;
}

export enum WS_RESPONSE_CODE {
  CONTINUE = 4000,
  GAME_NOT_FOUND,
  IN_SETUP
}

export interface IResponse {
  code: WS_RESPONSE_CODE,
  reason?: string
}

export interface IHandshake {
  req: HttpRequest,
  res: HttpResponse,
  context: us_listen_socket
}

export interface ILobbies {
  [key: string]: {
    connections: string[];
  }
}

export interface IConnections {
  [key: string]: string[];
}
