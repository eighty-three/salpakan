import uWS from 'uWebSockets.js';
import config from '@utils/config';
import { IGameStates } from '../game/types';

import * as mm from './matchmaking';
import * as game from './game';
import * as lobby from './lobby';
import * as count from './count';
import * as rematch from './rematch';
import * as statusIndicator from './statusIndicator';

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
  close: count.close,
  message: count.message
});

wsApp.ws('/ws/rematch/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: rematch.upgrade,
  open: rematch.open,
  close: rematch.close
});

wsApp.ws('/ws/lobby/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: lobby.upgrade,
  open: lobby.open,
  close: lobby.close
});

wsApp.ws('/ws/game/status/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  idleTimeout: 0,
  upgrade: statusIndicator.upgrade,
  open: statusIndicator.open,
  close: statusIndicator.close,
  message: statusIndicator.message
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
import { IName as gameNames } from '../game/types';

import { deleteLobbies } from '../lobby/model';
import { IName as lobbyNames } from '../lobby/types';
import { lobbies } from '../ws/lobby';

//every 30 minutes
const cleanup = cron.schedule('*/30 * * * *', async () => {
  const deletedGames: gameNames[] | null = await deleteGames();
  if (deletedGames?.length) {
    console.log(`Deleting ${deletedGames.length} game(s)...`);
    for (let i=0; i < deletedGames.length; i++) {
      delete gameStates[deletedGames[i].name];
    }
  }

  const deletedLobbies: lobbyNames[] | null = await deleteLobbies();
  if (deletedLobbies?.length) {
    console.log(`Deleting ${deletedLobbies.length} lobby(s????)...`);
    for (let i=0; i < deletedLobbies.length; i++) {
      delete lobbies[deletedLobbies[i].name];
    }
  }
});

cleanup.start();
