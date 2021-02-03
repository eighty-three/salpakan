import { gameStates } from './index';
import config from '@utils/config';
import { nanoid } from 'nanoid';

import { IUpgrade, IOpen, IClose } from './types';

import { getUsername } from '@authMiddleware/authToken';
import { startGame } from '../game/model';

interface IConnections {
  [key: string]: string[];
}

const connections: IConnections = {};

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = { aborted: false };
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  if (!connections[url]) {
    connections[url] = [];
  }

  if (
    cn
    && !connections[url].includes(cn)
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
  connections[socket.url].push(socket.cn);
  socket.subscribe(`${socket.url}_rm`);

  if (connections[socket.url].length > 1) {
    const newUrl = nanoid(10);
    await startGame(gameStates, newUrl, connections[socket.url]);

    socket.publish(`${socket.url}_rm`, newUrl);
  }
};

export const close: IClose<void> = async (socket) => {
  delete connections[socket.url];
};
