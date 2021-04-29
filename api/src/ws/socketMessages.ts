import { getGameInfo } from './utils';
import { WebSocket } from 'uWebSockets.js';
import { IRoom, TCoordinate, TPlayer } from '../game/types';

const FOR_GAME_START = (
  socket: WebSocket,
  room: IRoom
): void => {
  const gameInfo = getGameInfo(room);

  socket.publish(socket.url, JSON.stringify({
    type: 'onGameStart',
    data: gameInfo,
    board: room.board,
    turn: 'p1'
  }));
};

const FOR_MOVE = (
  socket: WebSocket,
  room: IRoom,
  result: number,
  coordinates: { origin: TCoordinate, destination: TCoordinate }
): void => {
  /* Add the time delay from the bot move
   * to the player to correct any discrepancies.
   * Only do so past the first move
   */
  if (room.bot && room.p2.time !== 6000) {
    room.p1.time = room.p1.time + 15;
  }

  const gameInfo = getGameInfo(room);

  const message = (!room.winner)
    ? JSON.stringify({
      type: 'onSocketMessageMove',
      data: { ...gameInfo, lastMove: coordinates },
      board: coordinates,
      result,
      turn: room.turn,
    }) : JSON.stringify({
      type: 'onSocketMessageMove',
      data: gameInfo,
      board: room.board,
      turn: room.turn,
    });

  socket.publish(socket.url, message);
};

const FOR_BOT_MOVE = (
  socket: WebSocket,
  room: IRoom,
  result: number,
  coordinates: { origin: TCoordinate, destination: TCoordinate }
): void => {
  room.p2.time = room.p2.time - 15;
  const gameInfo = getGameInfo(room);

  const message = (!room.winner)
    ? JSON.stringify({
      type: 'onSocketMessageMove',
      data: { ...gameInfo, lastMove: coordinates },
      board: coordinates,
      result,
      turn: room.turn,
      bot: true
    }) : JSON.stringify({
      type: 'onSocketMessageMove',
      data: gameInfo,
      board: room.board,
      turn: room.turn,
      bot: true
    });

  socket.publish(socket.url, message);
};

const FOR_WINNER = (
  socket: WebSocket,
  room: IRoom
): void => {
  const gameInfo = getGameInfo(room);

  socket.publish(socket.url, JSON.stringify({
    type: 'onSocketMessageMove',
    data: gameInfo,
    board: room.board,
    turn: room.turn
  }));
};

const FOR_TIME = (
  socket: WebSocket,
  room: IRoom
): void => {
  const gameInfo = getGameInfo(room);

  socket.publish(socket.url, JSON.stringify({
    type: 'onSocketMessageTime',
    data: gameInfo,
    board: room.board
  }));
};

const FOR_STATUS_INDICATOR = (
  socket: WebSocket,
  channel: string,
  connections: string[]
): void => {
  socket.publish(channel, JSON.stringify({
    type: 'forStatusIndicator',
    connections
  }));
};

const FOR_SOCKET_OPEN = (
  socket: WebSocket,
  room: IRoom,
): void => {
  const player = (room.playerList.includes(socket.cn))
    ? (socket.cn === room.p1.name) ? 'p1' : 'p2'
    : null;
  const spectator = room.spectators[socket.cn];

  const user = player || spectator; // whoever opened the socket
  const board = (user) ? room[user].board : room.board;

  let gameInfo, ongoingTurn;
  if (room.start) {
    gameInfo = getGameInfo(room, user);
    ongoingTurn = room.turn;

    /* If spectator, it won't go to this branch because
     * they'll be declined by the connectionHandler if
     * the room is in setup phase. Meaning, the player
     * is never null in this branch
     */
  } else if (player) {
    gameInfo = {
      time: room.time - Math.floor(Date.now() / 100),
      setup: (room[player].start),
      pin: room[player].pin
    };
    ongoingTurn = undefined;
  }

  socket.send(JSON.stringify({
    type: 'onSocketOpen',
    data: gameInfo,
    board,
    turn: ongoingTurn,
    player
  }));
};

const FOR_SPECTATE = (
  socket: WebSocket,
  room: IRoom,
  success: boolean
): void => {
  const spectator = room.spectators[socket.cn];
  const board = (spectator && success) ? room[spectator].board : room.board;
  const gameInfo = getGameInfo(room, spectator);

  socket.send(JSON.stringify({
    type: 'onSocketMessageSpectate',
    success,
    data: gameInfo,
    board
  }));
};

const FOR_SETUP_BUG = (
  socket: WebSocket,
  room: IRoom,
  player: TPlayer
): void => {
  socket.send(JSON.stringify({
    type: 'onSocketMessageReadyResubmit',
    board: room[player].board,
  }));
};

const FOR_MOVE_BUG = (
  socket: WebSocket,
  room: IRoom,
  player: TPlayer
): void => {
  const gameInfo = getGameInfo(room);

  socket.send(JSON.stringify({
    type: 'onSocketMessageBug',
    data: gameInfo,
    turn: player
  }));
};

const FOR_COUNT = (
  socket: WebSocket,
  count: number
): void => {
  socket.publish('count', JSON.stringify({
    message: count
  }));
};

const SendSocketMessage = {
  FOR_GAME_START,
  FOR_MOVE,
  FOR_BOT_MOVE,
  FOR_WINNER,
  FOR_TIME,
  FOR_STATUS_INDICATOR,
  FOR_SOCKET_OPEN,
  FOR_SPECTATE,
  FOR_SETUP_BUG,
  FOR_MOVE_BUG,
  FOR_COUNT
};

export default SendSocketMessage;
