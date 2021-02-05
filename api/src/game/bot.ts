import { IBoard, TPlayer } from './types';
import { checkIfLegal } from './utils';

const hasKey = <O>(obj: O, key: keyof any): key is keyof O => key in obj;

const addEmptySpace = (player: TPlayer, board: IBoard): IBoard => {
  const fixedBoard = { ...board };
  const row = (player === 'p1') ? 3 : 6;

  // Adds empty space to make the randomizeBoard function work properly
  for (let i=0; i < 6; i++) {
    const coordinate = `${String.fromCharCode(i+68)}${row}`;
    if (hasKey(fixedBoard, coordinate)) {
      fixedBoard[coordinate] = { name: 'empty' };
    }
  }

  return fixedBoard;
};

export const randomizeBoard = (player: TPlayer, initialBoard: IBoard): IBoard => {
  const board = addEmptySpace(player, initialBoard);
  const len = Object.keys(board).length - 1;

  // Shuffle the board
  for (let i = len; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const currentKey = Object.keys(board)[i];
    const randomKey = Object.keys(board)[j];

    if (hasKey(board, currentKey) && hasKey(board, randomKey)) {
      [board[currentKey], board[randomKey]] = [board[randomKey], board[currentKey]];
    }
  }


  // Delete the empty spaces
  for (let i = len; i > 0; i--) {
    const currentKey = Object.keys(board)[i];
    if (hasKey(board, currentKey)) {
      if (board[currentKey]?.name === 'empty') {
        delete board[currentKey];
      }
    }
  }

  return board;
};

const generateMoves = (board: IBoard, shuffledArray: number[]) => {
  const len = shuffledArray.length;
  const legalMoves = [];
  let origin;

  /* For each piece in the shuffled array, check if the said piece
   * has legal moves. Go through the array to find one that does
   *
   * Since it's already shuffled before being used in the following
   * for loop, the choices are already randomized so iterating like
   * this doesn't introduce bias
   */
  for (let i=0; i < len; i++) {
    origin = Object.keys(board)[shuffledArray[i]];
    const originRow = origin.charCodeAt(0);
    const originCol = Number(origin[1]);

    const arr = [];

    // List of possible moves a piece can make
    arr.push(`${String.fromCharCode(originRow)}${originCol-1}`);
    arr.push(`${String.fromCharCode(originRow)}${originCol+1}`);
    arr.push(`${String.fromCharCode(originRow-1)}${originCol}`);
    arr.push(`${String.fromCharCode(originRow+1)}${originCol}`);

    for (let i=0; i < 4; i++) {
      const destination = arr[i];

      if (hasKey(board, origin) && hasKey(board, destination)) {

        // Check if any of the possible moves are legal
        if(checkIfLegal(board, origin, destination)) {
          legalMoves.push(arr[i]);
        }
      }
    }

    if (legalMoves.length) break;
  }

  return { origin, moves: legalMoves };
};

export const getMove = (board: IBoard) => {
  const pieces = Object.keys(board).length;

  const shuffledArray = [];

  // Create an array from the pieces
  for (let i=0; i < pieces; i++) {
    shuffledArray.push(i);
  }


  // Shuffle said array
  for (let i = pieces-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Use the shuffled array to generate moves
  const { origin, moves } = generateMoves(board, shuffledArray);

  // Get a random move from the legal moves generated
  const len = moves.length;
  const randomMove = Math.floor(Math.random() * len);
  const destination = moves[randomMove];

  return { origin, destination };
};

/* Every key has roughly the same amount except C4 and D3
 * D3 is disproportionately higher because there are 2 possible instances for it
 * C4 is disproportionately lower because D3 takes away some of its chances
 * If you add D3 and C4 and divide it by two, it's basically the same as every other key

const obj: any = {};
for (let i=0; i < 100000; i++) {
  const { destination } = getMove(player1Board);

  if (!obj[destination]) {
    obj[destination] = [];
  }

  obj[destination].push(i);
}

for (const key in obj) {
  console.log(obj[key].length, key);
}
*/
