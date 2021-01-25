import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/game`;

import ON_MOVE from '@/sounds/on_move.mp3';
import ON_VS from '@/sounds/on_vs.mp3';

export const WSGAME_URL = `${WS_HOST}/ws/game`;

export const getGame = async (id) => {
  try {
    const req = ky.get(`${api}/${id}`);
    const response = await req.json();

    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

export const gameSocketOnMessage = (res, setters) => {
  const moveSound = new Audio(ON_MOVE);
  const vsSound = new Audio(ON_VS);

  switch (res.type) {
    case 'init':
      setters.gameInfo({ ...res.data, board: res.board });
      setters.turn(res.turn);
      setters.player(res.player);
      break;

    case 'start': {
      setters.gameInfo((prev) => {
        return {
          ...res.data,
          board: {
            ...res.board,
            ...prev.board
          }
        };
      });

      setters.turn(res.turn);

      moveSound.play();

      break;
    }

    case 'move': {
      let toPlay;
      setters.gameInfo((prev) => {
        toPlay = (prev.board[res.board.destination]) ? vsSound: moveSound;

        if (res.data.winner) {
          return {
            ...res.data,
            board: res.board
          };
        }

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

      setters.turn(res.turn);
      toPlay.play();

      break;
    }

    case 'time':
      if (res.data.winner) {
        setters.gameInfo({ ...res.data, board: res.board });
      } else {
        setters.gameInfo((prev) => {
          return {
            ...res.data,
            board: {
              ...res.board,
              ...prev.board
            }
          };
        });
      }

      break;

    case 'bug':
      setters.gameInfo((prev) => {
        return {
          ...res.data,
          board: prev.board
        };
      });

      setters.turn(res.turn);

      break;
  }
};

export const checkIfLegal = (board, origin, destination) => {
  try {
    if (origin.length !== 2 || destination.length !== 2) return false;

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

export const checkIfWithinBounds = (player, destination) => {
  if (destination.length !== 2) return false;

  const destRow = destination.charCodeAt(0);
  const destCol = Number(destination[1]);

  if (player === 'p1') {
    if (destCol <= 3 && destCol >= 1 && destRow >= 65 && destRow <= 73) return true;
    // A1 to I1, A3 to I3
  } else {
    if (destCol >= 6 && destCol <= 8 && destRow >= 65 && destRow <= 73) return true;
    //A6 to I6, A8 to I8
  }

  return false;
};
