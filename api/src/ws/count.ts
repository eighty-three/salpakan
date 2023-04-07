import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { decode, refreshPublishTime, handshakeHandler } from './utils';
import SendSocketMessage from './socketMessages';
import { IUpgrade, IOpen, IClose, IMessage } from './types';
import { ICount } from '../game/types';

export const count: ICount = { list: [], lastPublished: 0 };

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const user = await getUsername(req.getHeader('cookie'));

  // get IP address (getRemoteAddress is unnecessary in deployment)
  const IP = req.getHeader('y-real-ip') || decode(res.getRemoteAddress());

  // if there is no cookie, use the IP address as identifier
  const cn = user || IP;

  /* if the incoming connection has a cookie, check if the user
   * previously connected with just his IP address in order to
   * delete it to keep proper track of total connections
   */
  if (user) {
    const toDelete = count.list.indexOf(IP);
    if (toDelete > -1) count.list.splice(toDelete, 1);
  }

  const checks = [
    !!cn,
    (req.getHeader('origin') === config.CLIENT_HOST)
  ];
  const handshake = { req, res, context };
  handshakeHandler({ cn }, checks, handshake);
};

export const open: IOpen<void> = (socket) => {
  if (!count.list.includes(socket.cn)) {
    count.list.push(socket.cn);
  }

  socket.subscribe('count');
  SendSocketMessage.FOR_COUNT(socket, count.list.length);
  refreshPublishTime(count, 15, true);
};

export const close: IClose<void> = (socket) => {
  const toDelete = count.list.indexOf(socket.cn);
  if (toDelete > -1) count.list.splice(toDelete, 1);
};

export const message: IMessage<void> = (socket, message) => {
  const data = JSON.parse(decode(message));
  if (data.message === 'ping') {
    if (refreshPublishTime(count, 15)) {
      SendSocketMessage.FOR_COUNT(socket, count.list.length);
    }
  }
};
