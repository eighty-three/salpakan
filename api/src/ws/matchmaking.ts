import { nanoid } from 'nanoid';
import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { gameStates } from './index';
import { startGame } from '../game/model';
import { decode, handshakeHandler } from './utils';
import { IUpgrade, IOpen, IClose, IMessage } from './types';

let roomName = nanoid(10);
const connections: string[] = [];

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const cn = await getUsername(req.getHeader('cookie'));

  const checks = [
    !!cn,
    !!(cn && !connections.includes(cn)),
    (req.getHeader('origin') === config.CLIENT_HOST)
  ];
  const handshake = { req, res, context };
  handshakeHandler({ cn }, checks, handshake);
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
  /* Should always be either 1 or 0, so if a socket somehow closes, it means
   * the sole person trying to find a match closed it himself (i.e. tab closed)
   */
  connections.length = 0;
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const data = JSON.parse(decode(message));
  if (data.message === 'ping') {
    socket.send('pong');
  }
};
