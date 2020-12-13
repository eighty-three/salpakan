import uWS from 'uWebSockets.js';
import { nanoid } from 'nanoid';
import { performance } from 'perf_hooks';
import config from '@utils/config';

import { getUsername } from '@authMiddleware/authToken';
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
  idleTimeout: 0,
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

    const room = gameStates[socket.url];
    const player = (socket.cn === room.p1.name) ? 'p1' : 'p2';

    if (room.start) {
      const turn = (room.turn === room.p1.name) ? 'p1' : 'p2';
      const currentTime = performance.now() / 100;
      const elapsedTime = currentTime - room.lastClosed;
      room[`${turn}`].time = room[`${turn}`].time - elapsedTime;
      room.lastClosed = performance.now() / 100;
    }

    const gameData = (room.start)
      ? {
        gameState: room[`${player}`].board,
        turn: room.turn,
        p1: {
          name: room.p1.name,
          time: room.p1.time
        },
        p2: {
          name: room.p2.name,
          time: room.p2.time
        }
      }
      : {
        gameState: room[`${player}`].board,
        time: room.time
      };

    socket.send(JSON.stringify({
      type: 'init',
      data: gameData,
      user: socket.cn
    }));
  },
  close: (socket) => {
    const room = gameStates[socket.url];
    if (room?.start) {
      const turn = (room.turn === room.p1.name) ? 'p1' : 'p2';
      const currentTime = performance.now() / 100;
      const elapsedTime = currentTime - room.lastMove;
      room[`${turn}`].time = room[`${turn}`].time - elapsedTime;
      room.lastMove = performance.now() / 100;
      room.lastClosed = performance.now() / 100;
    }
  },
  message: async (socket, message) => {
    const data = JSON.parse(decode(message));

    const room = gameStates[socket.url];
    if (!room) {
      socket.close();
      return;
    }

    const player = (socket.cn === room.p1.name) ? 'p1' : 'p2';
    const opponent = (socket.cn === room.p1.name) ? 'p2' : 'p1';

    switch (data.type) {
      case 'ready': {
        room[`${player}`].start = true;

        if (
          room.p1.start
          && room.p2.start
        ) {
          const gameData = {
            gameState: room.board,
            turn: room.turn,
            p1: {
              name: room.p1.name,
              time: room.p1.time
            },
            p2: {
              name: room.p2.name,
              time: room.p2.time
            }
          };

          room.start = true;
          room.lastMove = performance.now() / 100;

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

      case 'move': {
        if (socket.cn === room.turn) {
          const currentTime = performance.now() / 100;
          const elapsedTime = currentTime - room.lastMove;
          room[`${player}`].time = room[`${player}`].time - elapsedTime;

          room.turn = room[`${opponent}`].name;
          room.lastMove = performance.now() / 100;

          const gameData = {
            gameState: room.board,
            turn: room.turn,
            p1: {
              name: room.p1.name,
              time: room.p1.time
            },
            p2: {
              name: room.p2.name,
              time: room.p2.time
            }
          };

          socket.publish(socket.url, JSON.stringify({ type: 'move', data: gameData }));
        }

        break;
      }
    }
  }
});

export default wsApp;
