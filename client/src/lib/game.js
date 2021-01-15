import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/game`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const connectToGame = (id, setGameInfo, setUser, setTurn) => {
  let socket = new WS(`${WS_HOST}/ws/game/${id}`);

  socket.onopen = () => {
    console.log('hello');
  };

  socket.onmessage = (message) => {
    const res = JSON.parse(message.data);

    switch (res.type) {
      case 'init':
        setGameInfo({ ...res.data, board: res.board });
        setUser(res.user);
        setTurn(res.turn);
        break;

      case 'start': {
        setGameInfo((prev) => {
          return {
            ...res.data,
            board: {
              ...res.board,
              ...prev.board
            }
          };
        });

        setTurn(res.turn);

        break;
      }

      case 'move':
        setGameInfo((prev) => {
          const fixedBoard = {...prev.board};
          delete fixedBoard[res.board.origin];

          /* Implicit case where res.result === 2 where the action is
           * just `delete fixedBoard[res.board.origin];`
           */
          if (res.result === 1) {
            fixedBoard[res.board.destination] = prev.board[res.board.origin];
          } else if (res.result === 3) {
            delete fixedBoard[res.board.destination];
          }

          return {
            ...res.data,
            board: {...fixedBoard}
          };
        });

        setTurn(res.turn);

        break;

      case 'time':
        setGameInfo({ ...res.data, board: res.board });
        break;

      case 'bug':
        setGameInfo((prev) => {
          return {
            ...res.data,
            board: prev.board
          };
        });

        setTurn(res.turn);

        break;
    }
  };

  socket.onclose = () => {
    setGameInfo(null);
  };

  socket.onerror = () => {
    console.log('no room');
  };

  return socket;
};

export const getGame = async (id) => {
  try {
    const req = ky.get(`${api}/${id}`);
    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

export const checkIfLegal = (board, origin, destination) => {
  try {
    const originRow = origin.charCodeAt(0);
    const destRow = destination.charCodeAt(0);
    const originCol = Number(origin[1]);
    const destCol = Number(destination[1]);

    /* If not within bounds then return false. Coordinates are from
     * A1 to I8, 'A'.charCodeAt() is 65, 'I'.charCodeAt() is 73,
     * so adding both origin and destination should always be within
     * 130-146 range, as is the case with the number part, with 2-16.
     * It can go through if the client somehow sends something like
     * 'A15' to 'A1' but it will be taken into account in the next
     * conditional statements, where it counts how many steps it took
     * from origin to destination
     */
    if (
      !((originRow + destRow >= 130 && originRow + destRow <= 146)
      && (originCol + destCol >= 2 && originCol + destCol <= 16))
    ) return false;

    /* If row changed just one step and if column stayed in place,
     * or vice versa, then return true. A piece can only move vertically
     * or horizontally one step at a time, e.g., A1 to B1, or A1 to A2.
     * Going from A1 to A3 or A1 to C1 is impossible
     */
    if (
      ((Math.abs(originRow - destRow) === 1) && (originCol - destCol === 0))
      || ((originRow - destRow === 0) && (Math.abs(originCol - destCol) === 1))
    ) {

      /* If move is legal, check if `origin` is a piece owned by the player,
       * and if `destination` is not occupied by a piece owned by the player.
       * The checks are done like so because in the client-side, if the player
       * knows the value of a piece, he owns it. Otherwise, it should only show
       * `{ name: 'unknown' }`
       */
      if (board[origin].value && !board[destination]?.value) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};
