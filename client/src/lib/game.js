import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/game`;

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

/**
 * checks two coordinates, e.g., `A1` and `B1`, to know if
 * movement between them is possible, and if the affected
 * pieces are owned by the correct player
 *
 * @param {IBoard} board The board of the player making the move
 * @param {object} coordinates The origin and destination of the move
 * @returns {boolean} true if legal, false otherwise
 */
export const checkIfLegal = (board, { origin, destination }) => {
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

/**
 * Checks two coordinates, if the piece is being placed within
 * the player's bounds. Used during setup to determine if the piece
 * is not crossing the three-row boundary of each player
 *
 * @param {player} board The player making the move
 * @param {TCoordinate} destination The coordinate where the move is going to
 * @returns {boolean} true if within bounds, false otherwise
 */
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

/**
 * checks two coordinates, e.g., `A1` and `B1`, to know if
 * what direction the piece is going. Used to indicate what
 * the last move is
 *
 * @param {TCoordinate} origin The coordinate where the move comes from
 * @param {TCoordinate} destination The coordinate where the move is going to
 * @returns {string} up, down, left, or right
 */
export const checkDirection = (origin, destination) => {
  const originRow = origin.charCodeAt(0);
  const destRow = destination.charCodeAt(0);
  const originCol = Number(origin[1]);
  const destCol = Number(destination[1]);

  if ((originRow - destRow) === 1) {
    return 'left';
  } else if ((originRow - destRow) === -1) {
    return 'right';
  } else if ((originCol - destCol) === 1) {
    return 'up';
  } else if ((originCol - destCol) === -1) {
    return 'down';
  }
};
