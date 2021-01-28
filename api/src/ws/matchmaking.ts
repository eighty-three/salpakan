import { gameStates } from './index';
import { nanoid } from 'nanoid';
import config from '@utils/config';

import { IUpgrade, IOpen, IClose, IMessage } from './types';
import { decode } from './utils';

import { getUsername } from '@authMiddleware/authToken';
import { startGame } from '../game/model';

let roomName = nanoid(10);
const connections: string[] = [];

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = {aborted: false};
  const cn = await getUsername(req.getHeader('cookie'));

  if (
    cn
    && !connections.includes(cn)
    && req.getHeader('origin') === config.CLIENT_HOST
  ) {
    res.upgrade(
      { cn },
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
  connections.push(socket.cn);
  socket.subscribe(`${roomName}_mm`);

  if (connections.length > 1) {
    await startGame(gameStates, roomName, connections);

    socket.publish(`${roomName}_mm`, roomName);
    connections.length = 0;
    roomName = nanoid(10);
  }
};

export const close: IClose<void> = () => {
  connections.length = 0;
  /* Should always be either 1 or 0, so if a socket somehow closes, it means
   * the sole person trying to find a match closed it himself (i.e. tab closed)
   */
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const data = JSON.parse(decode(message));
  if (data.message === 'ping') {
    socket.send('pong');
  }
};

