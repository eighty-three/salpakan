import uWS from 'uWebSockets.js';
import { nanoid } from 'nanoid';
import { getUsername } from '@authMiddleware/authToken';
import config from '@utils/config';

import { startGame } from './game/model';

import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');
const decode = (buf: ArrayBuffer) => decoder.write(Buffer.from(buf));

const wsApp = uWS.App();

let roomName = nanoid(10);
const connections: string[] = [];
const gameStates: any = {};

wsApp.ws('/matchmaking', {
  compression: 1,
  maxPayloadLength: 1024,
  upgrade: async (res, req, context) => {
    const upgradeAborted = {aborted: false};
    const username = await getUsername(req.getHeader('cookie'));
    const ipAddress = decode(res.getRemoteAddressAsText());
    const cn = username || ipAddress;

    if (
      !connections.includes(cn)
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
  },
  open: async (socket) => {
    connections.push(socket.cn);
    socket.subscribe(`${roomName}_mm`);

    if (connections.length > 1) {
      await startGame(gameStates, roomName, connections);

      socket.publish(`${roomName}_mm`, roomName);
      connections.length = 0;
      roomName = nanoid(10);
    }
  },
  close: () => {
    connections.length = 0;
    /* Should always be either 1 or 0, so if a socket somehow closes, it means
     * the sole person trying to find a match closed it himself (i.e. tab closed)
     */
  },
});

wsApp.ws('/game/:id', {
  compression: 1,
  maxPayloadLength: 1024,
  upgrade: async (res, req, context) => {
    const upgradeAborted = {aborted: false};
    const username = await getUsername(req.getHeader('cookie'));
    const ipAddress = decode(res.getRemoteAddressAsText());
    const cn = username || ipAddress;
    const url = req.getParameter(0);

    if (req.getHeader('origin') === config.CLIENT_HOST) {
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
  },
  open: (socket) => {
    socket.subscribe(socket.url);
  },
});

export default wsApp;
