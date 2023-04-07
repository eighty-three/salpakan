import { nanoid } from 'nanoid';
import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { gameStates } from './index';
import { startGame } from '../game/model';
import { handshakeHandler } from './utils';
import { IUpgrade, IOpen, IClose, IConnections } from './types';

const connections: IConnections = {};

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  if (!connections[url]) {
    connections[url] = [];
  }

  const checks = [
    !!cn,
    !!(cn && !connections[url].includes(cn)),
    (req.getHeader('origin') === config.CLIENT_HOST)
  ];
  const handshake = { req, res, context };
  handshakeHandler({ cn, url }, checks, handshake);
};

export const open: IOpen<Promise<void>> = async (socket) => {
  socket.subscribe(`${socket.url}_rm`);
  const newUrl = nanoid(10);

  if (gameStates[socket.url].bot) {
    await startGame(gameStates, newUrl, [socket.cn, 'Mr. Bot'], true);
    socket.publish(`${socket.url}_rm`, newUrl);
    return;
  }

  connections[socket.url].push(socket.cn);
  if (connections[socket.url].length > 1) {
    await startGame(gameStates, newUrl, connections[socket.url]);
    socket.publish(`${socket.url}_rm`, newUrl);
  }
};

export const close: IClose<void> = (socket) => {
  delete connections[socket.url];
};
