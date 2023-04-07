import { performance } from 'perf_hooks';
import config from '@utils/config';
import { getUsername } from '@authMiddleware/authToken';
import { gameStates } from './index';
import { cleanBoards, checkMove, checkIfLegal } from '../game/utils';
import { deleteGame } from '../game/model';
import { getMove } from '../game/bot';
import { TPlayer } from '../game/types';
import { decode, refreshTime, declareWinner, connectionHandler, handshakeHandler } from './utils';
import SendSocketMessage from './socketMessages';
import { IUpgrade, IOpen, IClose, IMessage, WS_RESPONSE_CODE } from './types';

export const upgrade: IUpgrade<Promise<void>> = async (res, req, context) => {
  const user = await getUsername(req.getHeader('cookie'));

  // get IP address (getRemoteAddress is unnecessary in deployment)
  const IP = req.getHeader('y-real-ip') || decode(res.getRemoteAddress());

  // if there is no cookie, use the IP address as identifier
  const cn = user || IP;

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
  socket.subscribe(socket.url);

  if (room.start) refreshTime(room, room.turn);
  SendSocketMessage.FOR_SOCKET_OPEN(socket, room);
};

export const close: IClose<void> = (socket) => {
  const room = gameStates[socket.url];
  if (room?.start) refreshTime(room, room.turn);
};

export const message: IMessage<Promise<void>> = async (socket, message) => {
  const room = gameStates[socket.url];
  /* Because of delays caused by a slow network, there's a chance that the client
   * would still send messages that aren't supposed to be sent anymore.
   */
  if (!room || room.winner) return;

  const player = (room.playerList.includes(socket.cn))
    ? (socket.cn === room.p1.name) ? 'p1' : 'p2'
    : null;

  const data = JSON.parse(decode(message));
  const opponent = (socket.cn === room.p1.name) ? 'p2' : 'p1';


  // If it's a request to spectate the game
  if (data.type === 'spectate') {
    let success = false;
    if (player) return; // disallow players from spectating
    if (data.player !== 'p1' && data.player !== 'p2') return; // validate 'player'
    const playerToSpectate = data.player as TPlayer;

    if (String(data.pin).length !== 5) return; // validate 'pin'
    if (data.pin === room[playerToSpectate].pin) {
      success = true;
      room.spectators[socket.cn] = playerToSpectate;
    }

    SendSocketMessage.FOR_SPECTATE(socket, room, success);
    return;
  }

  // Reject the message if the connection isn't from a player
  if (!player) return;

  switch (data.type) {
    case 'ready': {
      /* When the user opens two instances of the same room,
       * he can submit a board in the first instance, change up
       * the position in the second, and then submit it again
       *
       * This sends back the first board sent by the user,
       * ignoring the second board sent. Any other discrepancies
       * is dealt with by checkIfLegal in the client
       */
      if (room[player].start) {
        SendSocketMessage.FOR_SETUP_BUG(socket, room, player);
        return;
      }

      room[player].start = true;
      room[player].board = data.message;

      if (room.p1.start && room.p2.start) {
        room.start = true;
        room.lastMove = performance.now() / 100;
        cleanBoards(room.p1.board, room.p2.board, gameStates, socket.url);
        SendSocketMessage.FOR_GAME_START(socket, room);
      }
      break;
    }

    case 'move': {
      if (player !== room.turn) return;
      if (!checkIfLegal(room[player].board, data.message)) {
        SendSocketMessage.FOR_MOVE_BUG(socket, room, player);
        return;
      }

      refreshTime(room, player);

      const result = checkMove(gameStates, socket.url, player, data.message);
      room.positionHistory.push(`${data.message.origin}${data.message.destination}`);
      room.turn = opponent;
      if (room.winner) await declareWinner(gameStates, socket.url, room.winner);
      SendSocketMessage.FOR_MOVE(socket, room, result, data.message);

      if (room.bot && !room.winner) {
        const botMove = getMove(room.p2.board);
        const botMoveResult = checkMove(gameStates, socket.url, 'p2', botMove);
        room.positionHistory.push(`${botMove.origin}${botMove.destination}`);
        room.turn = 'p1';
        if (room.winner) await declareWinner(gameStates, socket.url, room.winner);
        SendSocketMessage.FOR_BOT_MOVE(socket, room, botMoveResult, botMove);
      }
      break;
    }

    case 'afk': {
      if (!room.start) {
        delete gameStates[socket.url];
        await deleteGame(socket.url);
      }
      break;
    }

    case 'time': {
      refreshTime(room, data.message);
      if (room.winner) await declareWinner(gameStates, socket.url, room.winner);
      SendSocketMessage.FOR_TIME(socket, room);
      break;
    }

    case 'surrender': {
      room.winner = room[opponent].name;
      await declareWinner(gameStates, socket.url, room.winner);
      SendSocketMessage.FOR_WINNER(socket, room);
      break;
    }

    default:
      break;
  }
};
