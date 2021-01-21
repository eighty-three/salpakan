import { gameStates } from './index';
import config from '@utils/config';
import { performance } from 'perf_hooks';

import { getUsername } from '@authMiddleware/authToken';
import { deleteGame, storeGame } from '../game/model';
import { cleanBoards, checkMove, checkIfLegal } from '../game/utils';
import { decode, refreshTime, getGameInfo } from './utils';

import { IUpgrade, IOpen, IClose, IMessage } from './types';

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const upgradeAborted = {aborted: false};
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
  socket.subscribe(socket.url);

  const room = gameStates[socket.url];
  const player = (socket.cn === room.p1.name) ? 'p1' : 'p2';
  const turn = (room.turn === room.p1.name) ? 'p1' : 'p2';

  let gameInfo, ongoingTurn;
  if (room.start) {
    refreshTime(room, turn);
    gameInfo = getGameInfo(room);
    ongoingTurn = turn;
  } else {
    gameInfo = {
      time: room.time - Math.floor(Date.now() / 100),
      player
    };
    ongoingTurn = undefined;
  }

  socket.send(JSON.stringify({
    type: 'init',
    data: gameInfo,
    board: room[player].board,
    user: socket.cn,
    turn: ongoingTurn,
    player
  }));
};

export const close: IClose<void> = (socket) => {
  const room = gameStates[socket.url];

  if (room?.start) {
    const turn = (room.turn === 'p1') ? 'p1' : 'p2';
    refreshTime(room, turn);
  }
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
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
      room[player].start = true;
      room[player].board = data.message;

      if (
        room.p1.start
        && room.p2.start
      ) {
        room.start = true;
        room.lastMove = performance.now() / 100;

        const { board1, board2, bothBoards } = cleanBoards(room.p1.board, room.p2.board);
        room.board = bothBoards;
        room.p1.board = board1;
        room.p2.board = board2;

        const gameInfo = getGameInfo(room);
        socket.publish(socket.url, JSON.stringify({
          type: 'start',
          data: gameInfo,
          board: room.board,
          turn: 'p1'
        }));
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
      if (player === room.turn) {
        const coordinates = {
          origin: data.message.o,
          destination: data.message.d
        };

        if (!checkIfLegal(coordinates.origin, coordinates.destination)) {
          const gameInfo = getGameInfo(room);

          socket.send(JSON.stringify({
            type: 'bug',
            data: gameInfo,
            turn: player
          }));
        } else {
          const result = checkMove(gameStates, socket.url, player, data.message.o, data.message.d);

          refreshTime(room, player);
          room.turn = opponent;

          const gameInfo = getGameInfo(room);

          if (gameInfo.winner) {
            delete gameStates[socket.url];
            await storeGame(socket.url, room.p1.board, room.p2.board, gameInfo.winner);
          }

          socket.publish(socket.url, JSON.stringify({
            type: 'move',
            data: gameInfo,
            board: coordinates,
            result,
            turn: room.turn
          }));
        }
      }

      break;
    }

    case 'time': {
      refreshTime(room, data.message);

      const gameInfo = getGameInfo(room);

      if (gameInfo.winner) {
        delete gameStates[socket.url];
        await storeGame(socket.url, room.p1.board, room.p2.board, gameInfo.winner);
      }

      socket.publish(socket.url, JSON.stringify({
        type: 'time',
        data: gameInfo,
        board: room.board
      }));
    }
  }
};
