import { IBoard, IGameStates, TPlayer } from './types';

export const getInitialBoardState = (player: TPlayer): IBoard => {
  const player1Board = {
    A1: { name: 'spy', value: 99 },
    A2: { name: 'spy', value: 99 },
    A3: { name: 'flag', value: 1 },
    A4: { name: 'private', value: 2 },
    A5: { name: 'private', value: 2 },
    A6: { name: 'private', value: 2 },
    A7: { name: 'private', value: 2 },
    A8: { name: 'private', value: 2 },
    B1: { name: 'private', value: 2 },
    B2: { name: 'sergeant', value: 3 },
    B3: { name: '2ndlt', value: 4 },
    B4: { name: '1stlt', value: 5 },
    B5: { name: 'captain', value: 6 },
    B6: { name: 'major', value: 7 },
    B7: { name: 'ltcol', value: 8 },
    B8: { name: 'col', value: 9 },
    C1: { name: '1star', value: 10 },
    C2: { name: '2star', value: 11 },
    C3: { name: '3star', value: 12 },
    C4: { name: '4star', value: 13 },
    C5: { name: '5star', value: 14 }
  };

  const player2Board = {
    I1: { name: 'spy', value: 99 },
    I2: { name: 'spy', value: 99 },
    I3: { name: 'flag', value: 1 },
    I4: { name: 'private', value: 2 },
    I5: { name: 'private', value: 2 },
    I6: { name: 'private', value: 2 },
    I7: { name: 'private', value: 2 },
    I8: { name: 'private', value: 2 },
    H1: { name: 'private', value: 2 },
    H2: { name: 'sergeant', value: 3 },
    H3: { name: '2ndlt', value: 4 },
    H4: { name: '1stlt', value: 5 },
    H5: { name: 'captain', value: 6 },
    H6: { name: 'major', value: 7 },
    H7: { name: 'ltcol', value: 8 },
    H8: { name: 'col', value: 9 },
    G1: { name: '1star', value: 10 },
    G2: { name: '2star', value: 11 },
    G3: { name: '3star', value: 12 },
    G4: { name: '4star', value: 13 },
    G5: { name: '5star', value: 14 }
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

  for (const x in b1) {
    bothBoards[x] = { name: 'unknown' };
    cleanB2[x] = { name: 'unknown' };
  }

  for (const x in b2) {
    bothBoards[x] = { name: 'unknown' };
    cleanB1[x] = { name: 'unknown' };
  }

  for (const x in b2) { cleanB1[x] = { name: 'unknown' }; }
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
 * @param {keyof IBoard} origin The coordinate where the move comes from
 * @param {keyof IBoard} destination The coordinate where the move is going to
 * @returns {number} impossible (0), success (1), failure (2), or draw (3)
 */
export const checkMove = (
  gameStates: IGameStates,
  roomName: string,
  player: TPlayer,
  origin: keyof IBoard,
  destination: keyof IBoard
): number => {
  const flag = gameStates[roomName].flagOnLastRow;
  const lastRow = (player === 'p1') ? 1 : 8;
  const opponent = (player === 'p1') ? 'p2' : 'p1';

  const o = gameStates[roomName][player].board[origin].value;
  const d = gameStates[roomName][opponent].board[destination]?.value || 0; // if destination isn't on opponent's board, it's empty (so 0)
  const dCheck = gameStates[roomName][player].board[destination]?.value; // if destination is on player's board, the move shouldn't be possible because you can't attack your own pieces

  // 1 for success, 2 for fail, 3 for draw
  let result = 1;

  // check if possible
  if (!o || dCheck) return 0;

  // Flow should be fixed to get expected response
  if (o === 99) { // If attacker is Spy
  } else if (o === 2) { // If attacker is Private
  } else if (o > d) { // If attacker is stronger than target
  } else if (d > o) { // If target is stronger than attacker
    result = 2;
  } else if (d === o) { // If draw
    result = 3;
  } else if (d === 1) { // If target is flag
  } else if (o === 1 && d !== 1) { // If attacker is flag and target is not flag
  } else if (o === 1 && Number(String(destination)[1]) === lastRow) { // If attacker is flag and destination is on last row
    gameStates[roomName].flagOnLastRow = String(destination);
  } else if (flag && destination !== flag) { // If there is a flag on last row and the destination isn't on that flag's position
  }

  return result;
};
