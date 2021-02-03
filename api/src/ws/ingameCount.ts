import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';

import { decode, refreshPublishTime } from './utils';
import { IUpgrade, IOpen, IClose, IMessage } from './types';


import { gameStates } from './index';
import { count } from './count';

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = { aborted: false };
  const cn = await getUsername(req.getHeader('cookie'));
  const url = req.getParameter(0);

  if (
    cn
    && gameStates[url]?.playerList.includes(cn)
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
  const channel = `gameCount_${socket.url}`;
  const room = gameStates[socket.url];

  /* Adds to main count on socket open
   *
   * socket.publish and socket.subscribe to the main 'count'
   * channel aren't necessary here
   *
   * The refresh in the homepage is sufficient for the update of the
   * total count. It doesn't have to waste another 'publish' call
   */
  if (!count.list.includes(socket.cn)) {
    count.list.push(socket.cn);
  }


  // publish current connections to the game
  if (!room.connections.list.includes(socket.cn)) {
    room.connections.list.push(socket.cn);
  }

  socket.subscribe(channel);
  socket.publish(channel, JSON.stringify({
    type: 'forStatusIndicator',
    connections: room.connections.list
  }));

  refreshPublishTime(room.connections, 3, true);
};

export const close: IClose<void> = (socket) => {
  const room = gameStates[socket.url];

  // delete user from main 'count'
  const forCountDelete = count.list.indexOf(socket.cn);
  if (forCountDelete > -1) count.list.splice(forCountDelete, 1);


  // delete user from room connections
  const forRoomDelete = room.connections.list.indexOf(socket.cn);
  if (forRoomDelete > -1) room.connections.list.splice(forRoomDelete, 1);
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const data = JSON.parse(decode(message));
  const room = gameStates[socket.url];
  const channel = `gameCount_${socket.url}`;

  // Instead of "ponging" back, publish the updated connections list
  if (data.type === 'ping') {
    if (refreshPublishTime(room.connections, 3)) {
      socket.publish(channel, JSON.stringify({
        type: 'forStatusIndicator',
        connections: room.connections.list
      }));
    }
  }
};
