import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { gameStates } from './index';
import { startGame } from '../game/model';
import { deleteLobby } from '../lobby/model';
import { handshakeHandler } from './utils';
import { IUpgrade, IOpen, IClose, ILobbies } from './types';

export const lobbies: ILobbies = {};

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  if (!lobbies[url]) {
    lobbies[url] = { connections: []};
  }

  const checks = [
    !!cn,
    !!(cn && !lobbies[url].connections.includes(cn)),
    (req.getHeader('origin') === config.CLIENT_HOST)
  ];
  const handshake = { req, res, context };
  handshakeHandler({ cn, url }, checks, handshake);
};

export const open: IOpen<Promise<void>> = async (socket) => {
  socket.subscribe(`${socket.url}_pl`);
  lobbies[socket.url].connections.push(socket.cn);

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
