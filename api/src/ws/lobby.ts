import { gameStates } from './index';
import config from '@utils/config';

import { IUpgrade, IOpen, IClose } from './types';

import { getUsername } from '@authMiddleware/authToken';
import { startGame } from '../game/model';
import { deleteLobby } from '../lobby/model';

interface ILobbies {
  [key: string]: {
    connections: string[];
  }
}

export const lobbies: ILobbies = {};

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = { aborted: false };
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  if (!lobbies[url]) {
    lobbies[url] = {
      connections: [],
    };
  }

  if (
    cn
    && !lobbies[url].connections.includes(cn)
    && req.getHeader('origin') === config.CLIENT_HOST
  ) {
    res.upgrade(
      { cn, url },
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

export const open: IOpen<Promise<void>> = async (socket) => {
  lobbies[socket.url].connections.push(socket.cn);
  socket.subscribe(`${socket.url}_pl`);

  if (lobbies[socket.url].connections.length > 1) {
    // start the game
    await startGame(gameStates, socket.url, lobbies[socket.url].connections);

    // and delete it in memory and in the database
    delete lobbies[socket.url];
    await deleteLobby(socket.url);

    socket.publish(`${socket.url}_pl`, socket.url);
  }
};

export const close: IClose<void> = (socket) => {
  if (lobbies[socket.url]) {
    const toDelete = lobbies[socket.url].connections.indexOf(socket.cn);
    if (toDelete > -1) lobbies[socket.url].connections.splice(toDelete, 1);
  }
};
