import uWS from 'uWebSockets.js';
import { IGameStates } from '../game/types';
import * as mm from './matchmaking';
import * as game from './game';

const wsApp = uWS.App();

wsApp.ws('/matchmaking', {
  compression: 1,
  maxPayloadLength: 1024,
  upgrade: mm.upgrade,
  open: mm.open,
  close: mm.close
});

wsApp.ws('/game/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: game.upgrade,
  open: game.open,
  close: game.close,
  message: game.message
});

export const gameStates: IGameStates = {};

export default wsApp;
