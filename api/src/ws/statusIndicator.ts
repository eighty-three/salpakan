import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { gameStates } from './index';
import { count } from './count';
import { decode, connectionHandler, refreshPublishTime, handshakeHandler } from './utils';
import SendSocketMessage from './socketMessages';
import { IUpgrade, IOpen, IClose, IMessage, WS_RESPONSE_CODE } from './types';

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  const checks = [(req.getHeader('origin') === config.CLIENT_HOST)];
  const handshake = { req, res, context };
  handshakeHandler({ cn, url }, checks, handshake);
};

export const open: IOpen<void> = (socket) => {
  const { code, reason } = connectionHandler(gameStates, socket.url, socket.cn);
  if (code !== WS_RESPONSE_CODE.CONTINUE) {
    socket.end(code, reason);
    return;
  }

  const room = gameStates[socket.url];
  const channel = `gameCount_${socket.url}`;

  // Adds to main count on socket open
  if (!count.list.includes(socket.cn)) {
    count.list.push(socket.cn);
  }

  // Publish current connections to the game
  if (
    !room.connections.list.includes(socket.cn)
    && room.playerList.includes(socket.cn)
  ) {
    room.connections.list.push(socket.cn);
  }

  socket.subscribe(channel);
  SendSocketMessage.FOR_STATUS_INDICATOR(socket, channel, room.connections.list);
  refreshPublishTime(room.connections, 3, true);
};

export const close: IClose<void> = (socket) => {
  const room = gameStates[socket.url];

  // Delete user from main 'count'
  const forCountDelete = count.list.indexOf(socket.cn);
  if (forCountDelete > -1) count.list.splice(forCountDelete, 1);

  // Do not continue if the room was already deleted before socket was closed
  if (!room) return;

  // Delete user from room connections
  const forRoomDelete = room.connections.list.indexOf(socket.cn);
  if (forRoomDelete > -1) room.connections.list.splice(forRoomDelete, 1);
};

export const message: IMessage<void> = (socket, message) => {
  const { code, reason } = connectionHandler(gameStates, socket.url, socket.cn);
  if (code !== WS_RESPONSE_CODE.CONTINUE) {
    socket.end(code, reason);
    return;
  }

  const room = gameStates[socket.url];
  const channel = `gameCount_${socket.url}`;

  const data = JSON.parse(decode(message));
  if (data.type === 'ping') {
    if (refreshPublishTime(room.connections, 3)) {
      SendSocketMessage.FOR_STATUS_INDICATOR(socket, channel, room.connections.list);
    }
  }
};
