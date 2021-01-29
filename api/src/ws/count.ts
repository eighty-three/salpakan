import config from '@utils/config';

import { IUpgrade, IOpen, IClose, IMessage } from './types';
import { decode } from './utils';

import { getUsername } from '@authMiddleware/authToken';

const connections: string[] = [];

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = {aborted: false};

  // get decoded token inside cookie
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
    const toDelete = connections.indexOf(IP);
    if (toDelete > -1) connections.splice(toDelete, 1);
  }

  if (
    cn
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
  if (!connections.includes(socket.cn)) {
    connections.push(socket.cn);
  }

  socket.subscribe('count');
  socket.publish('count', String(connections.length));
};

export const close: IClose<void> = (socket) => {
  const toDelete = connections.indexOf(socket.cn);
  if (toDelete > -1) connections.splice(toDelete, 1);
};

/* If the game ever reaches 1000 concurrent users I'll probably remove
 * all of these checks and just add a simple counter that adds the
 * incoming connection no matter what. The higher the actual users,
 * the less effect someone who wants to bother messing with the count
 * can actually manage. So for now, iterating over all the connections
 * is fine since looping over 50 (if I'm lucky) items some n times is
 * very very very insignificant
 */

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const data = JSON.parse(decode(message));
  if (data.message === 'ping') {
    socket.send('pong');
  }
};
