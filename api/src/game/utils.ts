import { IBoard, IGameStates, TPlayer, TCoordinate } from './types';

export const getInitialBoardState = (player: TPlayer): IBoard => {
  const player1Board = {
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
    B2: { name: '2ndlt', value: 4 },
    C2: { name: '1stlt', value: 5 },
    D2: { name: 'captain', value: 6 },
    E2: { name: 'major', value: 7 },
    F2: { name: 'ltcol', value: 8 },
    G2: { name: 'col', value: 9 },
    H2: { name: '1star', value: 10 },
    I2: { name: '2star', value: 11 },
    A3: { name: '3star', value: 12 },
    B3: { name: '4star', value: 13 },
    C3: { name: '5star', value: 14 }
  };

  const player2Board = {
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
    B7: { name: '2ndlt', value: 4 },
    C7: { name: '1stlt', value: 5 },
    D7: { name: 'captain', value: 6 },
    E7: { name: 'major', value: 7 },
    F7: { name: 'ltcol', value: 8 },
    G7: { name: 'col', value: 9 },
    H7: { name: '1star', value: 10 },
    I7: { name: '2star', value: 11 },
    A6: { name: '3star', value: 12 },
    B6: { name: '4star', value: 13 },
    C6: { name: '5star', value: 14 }
  };

  return (player === 'p1') ? player1Board : player2Board;
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
 * @returns {Object} An object with `b1` and `b2` (no values) combined, an object with `b1` (no values) and `b2` combined, and an object that contains `b1` and `b2` with both having no values
 */
export const cleanBoards = (
  b1: IBoard,
  b2: IBoard
): { board1: IBoard, board2: IBoard, bothBoards: IBoard } => {
  const cleanB1: IBoard = {...b1};
  const cleanB2: IBoard = {...b2};
  const bothBoards: IBoard = {};

  for (const key in b1) {
    bothBoards[key as TCoordinate] = { name: 'unknown' };
    cleanB2[key as TCoordinate] = { name: 'unknown' };
  }

  for (const key in b2) {
    bothBoards[key as TCoordinate] = { name: 'unknown' };
    cleanB1[key as TCoordinate] = { name: 'unknown' };
  }

  return { board1: cleanB1, board2: cleanB2, bothBoards };
};

/**
 * checks two coordinates, e.g., `A1` and `B1`, to know if
 * movement between them is possible. It should be legal and the
 * pieces should be in the possession of the correct player
 *
 * @param {IGameStates} gameState The object containing all rooms and their data
 * @param {string} roomName id/url of the room
 * @param {TPlayer} player The player who sent the move ('p1' or 'p2')
 * @param {TCoordinate} origin The coordinate where the move comes from
 * @param {TCoordinate} destination The coordinate where the move is going to
 * @returns {number} impossible (0), success (1), failure (2), or draw (3)
 */
export const checkMove = (
  gameStates: IGameStates,
  roomName: string,
  player: TPlayer,
  origin: TCoordinate,
  destination: TCoordinate
): number => {
  const room = gameStates[roomName];
  const flag = room.flagOnLastRow;
  const lastRow = (player === 'p1') ? '1' : '8';
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
    // If attacker is same piece as target
    result = 3;
  } else if (o === 99) {
    // If attacker is a spy, check if target is private
    result = (d === 2) ? 2 : 1;
  } else if (o === 2) {
    // If attacker is a private, check if target is spy
    result = (d === 99) ? 1 : 2;
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
