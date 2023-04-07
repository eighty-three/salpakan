import { IBoard, IGameStates, TPlayer, TCoordinate } from './types';

export const player1Board = {
  A1: { name: 'spy', value: 99 },
  B1: { name: 'spy', value: 99 },
  C1: { name: 'flag', value: 1 },
  D1: { name: 'private', value: 2 },
  E1: { name: 'private', value: 2 },
  F1: { name: 'private', value: 2 },
  G1: { name: 'private', value: 2 },
  H1: { name: 'private', value: 2 },
  I1: { name: 'private', value: 2 },
  A2: { name: 'sergeant', value: 3 },
  B2: { name: 'lt2', value: 4 },
  C2: { name: 'lt1', value: 5 },
  D2: { name: 'captain', value: 6 },
  E2: { name: 'major', value: 7 },
  F2: { name: 'ltcol', value: 8 },
  G2: { name: 'colonel', value: 9 },
  H2: { name: 'gen1', value: 10 },
  I2: { name: 'gen2', value: 11 },
  A3: { name: 'gen3', value: 12 },
  B3: { name: 'gen4', value: 13 },
  C3: { name: 'gen5', value: 14 }
};

export const player2Board = {
  A8: { name: 'spy', value: 99 },
  B8: { name: 'spy', value: 99 },
  C8: { name: 'flag', value: 1 },
  D8: { name: 'private', value: 2 },
  E8: { name: 'private', value: 2 },
  F8: { name: 'private', value: 2 },
  G8: { name: 'private', value: 2 },
  H8: { name: 'private', value: 2 },
  I8: { name: 'private', value: 2 },
  A7: { name: 'sergeant', value: 3 },
  B7: { name: 'lt2', value: 4 },
  C7: { name: 'lt1', value: 5 },
  D7: { name: 'captain', value: 6 },
  E7: { name: 'major', value: 7 },
  F7: { name: 'ltcol', value: 8 },
  G7: { name: 'colonel', value: 9 },
  H7: { name: 'gen1', value: 10 },
  I7: { name: 'gen2', value: 11 },
  A6: { name: 'gen3', value: 12 },
  B6: { name: 'gen4', value: 13 },
  C6: { name: 'gen5', value: 14 }
};

export const getInitialBoardState = (player: TPlayer): IBoard => {
  return (player === 'p1') ? { ...player1Board } : { ...player2Board };
};

/**
 * Receives the players' boards and `cleans` them, that is, removing
 * the values of the opponent's pieces in order for the data to be
 * published or sent to the player (because otherwise, the player
 * would then know the values of the opponent's pieces which would
 * make the game pointless)
 *
 * @param {IBoard} b1 First board (from player 1)
 * @param {IBoard} b2 Second board (from player 2)
 * @param {IGameStates} gameStates The object containing all rooms and their data
 * @param {string} roomName id/url of the room
 * @returns {void}
 */
export const cleanBoards = (
  b1: IBoard,
  b2: IBoard,
  gameStates: IGameStates,
  roomName: string
): void => {
  const cleanB1: IBoard = { ...b1 };
  const cleanB2: IBoard = { ...b2 };
  const bothBoards: IBoard = {};

  for (const key in b1) {
    bothBoards[key as TCoordinate] = { name: 'unknown', owner: 'p1' };
    cleanB2[key as TCoordinate] = { name: 'unknown', owner: 'p1' };
  }

  for (const key in b2) {
    bothBoards[key as TCoordinate] = { name: 'unknown', owner: 'p2' };
    cleanB1[key as TCoordinate] = { name: 'unknown', owner: 'p2' };
  }

  gameStates[roomName].board = bothBoards;
  gameStates[roomName].p1.board = cleanB1;
  gameStates[roomName].p2.board = cleanB2;
};

/**
 * Receives the players' boards and removes the keys with a value of
 * { name: 'unknown' }, while also adding { owner: 'loser' } to
 * the board of the loser.
 *
 * @param {IBoard} winnerBoard Board of the winner
 * @param {IBoard} loserBoard Board of the loser
 * @returns {Object} An object containing the fixed `winnerBoard` and fixed `loserBoard`
 */
export const removeUnknownValues = (
  winnerBoard: IBoard,
  loserBoard: IBoard
): { fixedWinnerBoard: IBoard, fixedLoserBoard: IBoard } => {
  const fixedWinnerBoard: IBoard = { ...winnerBoard };
  const fixedLoserBoard: IBoard = { ...loserBoard };

  for (const key in fixedWinnerBoard) {
    if (fixedWinnerBoard[key as TCoordinate]?.name === 'unknown') {
      delete fixedWinnerBoard[key as TCoordinate];
    }
  }

  for (const key in fixedLoserBoard) {
    const name = fixedLoserBoard[key as TCoordinate]?.name;
    const value = fixedLoserBoard[key as TCoordinate]?.value;

    if (name === 'unknown') {
      delete fixedLoserBoard[key as TCoordinate];
    } else if (name) {
      fixedLoserBoard[key as TCoordinate] = {
        name,
        value,
        owner: 'loser'
      };
    }
  }

  return { fixedWinnerBoard, fixedLoserBoard };
};

/**
 * checks two coordinates, e.g., `A1` and `B1`, to know if
 * movement between them is possible
 *
 * @param {IBoard} board The board of the player making the move
 * @param {object} coordinates The origin and destination of the move
 * @returns {boolean} true if legal, false otherwise
 */
export const checkIfLegal = (
  board: IBoard,
  coordinates: { origin: TCoordinate, destination: TCoordinate }
): boolean => {
  try {
    const { origin, destination } = coordinates;
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
      if (board[origin]?.value && !board[destination]?.value) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * checks two coordinates, e.g., `A1` and `B1`, to know if
 * movement between them is possible. It should be legal and the
 * pieces should be in the possession of the correct player
 *
 * @param {IGameStates} gameState The object containing all rooms and their data
 * @param {string} roomName id/url of the room
 * @param {TPlayer} player The player who sent the move ('p1' or 'p2')
 * @param {object} coordinates The origin and destination of the move
 * @returns {number} impossible (0), success (1), failure (2), or draw (3)
 */
export const checkMove = (
  gameStates: IGameStates,
  roomName: string,
  player: TPlayer,
  coordinates: { origin: TCoordinate, destination: TCoordinate }
): number => {
  const { origin, destination } = coordinates;

  const room = gameStates[roomName];
  const flag = room.flagOnLastRow;
  const lastRow = (player === 'p1') ? '8' : '1';
  const opponent = (player === 'p1') ? 'p2' : 'p1';
  const playerBoard = room[player].board;
  const opponentBoard = room[opponent].board;

  const o = playerBoard[origin]?.value;

  // if destination isn't on opponent's board, it's empty (so 0)
  const d = opponentBoard[destination]?.value || 0;

  const dCheck = playerBoard[destination]?.value;

  /* Check if origin piece is owned by the player. Also, if
   * destination is on player's board, the move shouldn't be possible
   * because you can't attack your own pieces
   */
  if (!o || dCheck) return 0;

  // Determine result between attacker and target
  let result = 0;

  if (o === d) {
    // If attacker is same piece as target, check if the pieces are flags
    result = (o === 1) ? 1 : 3;
  } else if (o === 99) {
    // If attacker is a spy, check if target is private
    result = (d === 2) ? 2 : 1;
  } else if (o === 2) {
    // If attacker is a private, check if target is spy
    result = (d === 99 || d < 2) ? 1 : 2;
  } else if (o > d) {
    // If attacker is stronger than target
    result = 1;
  } else if (o < d) {
    // If target is stronger than attacker
    result = 2;
  }


  // Apply 'side effects' to game data

  if (flag && destination !== flag) {
    // If there is a flag on last row and the destination isn't on that flag's position
    room.winner = room[opponent].name;
  }

  if (d === 1) {
    // If target is flag
    room.winner = room[player].name;
  }

  if (o === 1) {
    // If attacker is flag
    if (result === 2) {
      /* If attacker lost to target, that is, the player attacked with a flag but
       * the target wasn't a flag or an empty space
       */
      room.winner = room[opponent].name;
    }

    if (destination[1] === lastRow) {
      // If destination is on last row
      room.flagOnLastRow = destination;
    }
  }


  // Fix boards

  if (result === 1) {
    // move attacker to destination
    playerBoard[destination] = playerBoard[origin];
    opponentBoard[destination] = opponentBoard[origin];
    room.board[destination] = room.board[origin];
  } else if (result === 3) {
    // delete both attacker and target
    delete playerBoard[destination];
    delete opponentBoard[destination];
    delete room.board[destination];
  }

  // delete attacker (covers 'result === 2' branch)
  delete playerBoard[origin];
  delete opponentBoard[origin];
  delete room.board[origin];

  return result;
};
