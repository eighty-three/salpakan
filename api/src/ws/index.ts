import uWS from 'uWebSockets.js';
import { IGameStates } from '../game/types';
import config from '@utils/config';

import * as mm from './matchmaking';
import * as game from './game';
import * as lobby from './lobby';
import * as count from './count';

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
  idleTimeout: 0,
  upgrade: mm.upgrade,
  open: mm.open,
  close: mm.close,
  message: mm.message
});

wsApp.ws('/ws/count', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: count.upgrade,
  open: count.open,
  close: count.close
});

wsApp.ws('/ws/lobby/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: lobby.upgrade,
  open: lobby.open,
  close: lobby.close
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


import cron from 'node-cron';
import { deleteGames } from '../game/model';
import { IName } from '../game/types';

const task = cron.schedule('*/30 * * * *', async () => {
  const deletedGames: IName[] | null = await deleteGames();
  if (deletedGames?.length) {
    console.log(`Deleting ${deletedGames.length} game(s)...`);
    for (let i=0; i < deletedGames.length; i++) {
      delete gameStates[deletedGames[i].name];
    }
  }
});

task.start();
