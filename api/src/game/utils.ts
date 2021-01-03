import { IBoard, TPlayer } from './types';

const pieces = [
  { name: 'spy', value: 99 },
  { name: 'spy', value: 99 },
  { name: 'flag', value: 1 },
  { name: 'private', value: 2 },
  { name: 'private', value: 2 },
  { name: 'private', value: 2 },
  { name: 'private', value: 2 },
  { name: 'private', value: 2 },
  { name: 'private', value: 2 },
  { name: 'sergeant', value: 3 },
  { name: '2ndlt', value: 4 },
  { name: '1stlt', value: 5 },
  { name: 'captain', value: 6 },
  { name: 'major', value: 7 },
  { name: 'ltcol', value: 8 },
  { name: 'col', value: 9 },
  { name: '1star', value: 10 },
  { name: '2star', value: 11 },
  { name: '3star', value: 12 },
  { name: '4star', value: 13 },
  { name: '5star', value: 14 }
];

export const getInitialBoardState = (player: TPlayer): IBoard => {
  const board: IBoard = {};
  const rows = (player === 'p1')
    ? ['A', 'B', 'C']
    : ['I', 'H', 'G'];

  for (let i = 0; i < pieces.length; i++) {
    let x;
    const y = `${i % 8 + 1}`;
    if (i < 8) {
      x = rows[0];
    } else if (i < 16) {
      x = rows[1];
    } else if (i < 24) {
      x = rows[2];
    }

    board[x + y] = pieces[i];
  }

  return board;
};
