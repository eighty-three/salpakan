import uWS from 'uWebSockets.js';
import shortid from 'shortid';
import { getUsername } from '@authMiddleware/authToken';

import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');
const decode = (buf: ArrayBuffer) => decoder.write(Buffer.from(buf));

const wsApp = uWS.App();

let roomName = shortid.generate();
const connections: string[] = [];
const gameStates: any = {};

wsApp.ws('/matchmaking', {
  compression: 1,
  maxPayloadLength: 2 * 1024,
  upgrade: async (res, req, context) => {
    const upgradeAborted = {aborted: false};
    const username = await getUsername(req.getHeader('cookie'));
    const ipAddress = decode(res.getRemoteAddressAsText());
    const cn = username || ipAddress;

    if (!connections.includes(cn)) {
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
  },
  open: (socket) => {
    connections.push(socket.cn);
    socket.subscribe(`${roomName}_mm`);

    if (connections.length > 1) {
      socket.publish(`${roomName}_mm`, roomName);

      gameStates[roomName] = {
        playerList: connections,
      };

      connections.length = 0;
      roomName = shortid.generate();
    }
  },
  close: () => {
    connections.length = 0;
    /* Should always be either 1 or 0, so if a socket somehow closes, it means
     * the sole person trying to find a match closed it himself (i.e. tab closed)
     */
  },
});

export default wsApp;
