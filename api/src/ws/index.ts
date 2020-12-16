import uWS from 'uWebSockets.js';
import { IGameStates } from '../game/types';
import * as mm from './matchmaking';
import * as game from './game';
import config from '@utils/config';

const options = {
  key_file_name: '../../misc/privkey.pem',
  cert_file_name: '../../misc/cert.pem'
};

const wsApp = (config.NODE_ENV === 'production')
  ? uWS.SSLApp(options)
  : uWS.App();

wsApp.ws('/ws/matchmaking', {
  compression: 1,
  maxPayloadLength: 1024,
  upgrade: mm.upgrade,
  open: mm.open,
  close: mm.close
});

wsApp.ws('/ws/game/:id', {
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
