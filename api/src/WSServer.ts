import uWS from 'uWebSockets.js';
import { nanoid } from 'nanoid';
import { getUsername } from '@authMiddleware/authToken';
import config from '@utils/config';

import { startGame, deleteGame } from './game/model';

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

    if (
      gameStates[url]?.playerList.includes(cn)
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
  },
  open: async (socket) => {
    socket.subscribe(socket.url);
    const player = (socket.cn === gameStates[socket.url].p1.name)
      ? 'p1'
      : 'p2';

    const gameData = (gameStates[socket.url].start)
      ? {
        gameState: gameStates[socket.url][`${player}`].board,
        turn: gameStates[socket.url].turn,
        p1: {
          name: gameStates[socket.url].p1.name,
          time: gameStates[socket.url].p1.time
        },
        p2: {
          name: gameStates[socket.url].p2.name,
          time: gameStates[socket.url].p2.time
        }
      }
      : {
        gameState: gameStates[socket.url][`${player}`].board,
        time: gameStates[socket.url].time
      };

    socket.send(JSON.stringify({ type: 'init', data: gameData }));
  },
  message: async (socket, message) => {
    const data = JSON.parse(decode(message));

    switch (data.type) {
      case 'ready': {
        const player = (socket.cn === gameStates[socket.url].p1.name)
          ? 'p1'
          : 'p2';

        const gameData = {
          gameState: gameStates[socket.url].board,
          turn: gameStates[socket.url].turn,
          p1: {
            name: gameStates[socket.url].p1.name,
            time: gameStates[socket.url].p1.time
          },
          p2: {
            name: gameStates[socket.url].p2.name,
            time: gameStates[socket.url].p2.time
          }
        };

        gameStates[socket.url][`${player}`].start = true;

        if (
          gameStates[socket.url].p1.start
          && gameStates[socket.url].p2.start
        ) {
          gameStates[socket.url].start = true;
          socket.publish(socket.url, JSON.stringify({ type: 'start', data: gameData }));
        }
        break;
      }

      case 'afk':
        socket.unsubscribeAll();
        socket.close();
        delete gameStates[socket.url];
        await deleteGame(socket.url);
        break;
    }
  }
});

export default wsApp;
