import config from '@utils/config';

import { decode, refreshPublishTime } from './utils';
import { IUpgrade, IOpen, IClose, IMessage } from './types';
import { ICount } from '../game/types';

import { getUsername } from '@authMiddleware/authToken';

export const count: ICount = {
  list: [],
  lastPublished: 0
};

/* If the game ever reaches 1000 concurrent users I'll probably remove
 * all of these checks and just add a simple counter that adds the
 * incoming connection no matter what. The higher the actual users,
 * the less effect someone who wants to bother messing with the count
 * can actually manage. So for now, iterating over all the connections
 * is fine since looping over 50 (if I'm lucky) items some n times is
 * very very very insignificant
 */
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
    const toDelete = count.list.indexOf(IP);
    if (toDelete > -1) count.list.splice(toDelete, 1);
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
  if (!count.list.includes(socket.cn)) {
    count.list.push(socket.cn);
  }

  socket.subscribe('count');
  socket.publish('count', JSON.stringify({
    message: String(count.list.length)
  }));

  refreshPublishTime(count, true);
};

export const close: IClose<void> = (socket) => {
  const toDelete = count.list.indexOf(socket.cn);
  if (toDelete > -1) count.list.splice(toDelete, 1);
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const data = JSON.parse(decode(message));

  // Instead of "ponging" back, just publish the updated count
  if (data.message === 'ping') {

    // Prevents spamming of count, allowing publish only every 15 seconds
    if (refreshPublishTime(count)) {
      socket.publish('count', JSON.stringify({
        message: String(count.list.length)
      }));
    }
  }
};
