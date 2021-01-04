import { IBoard, TPlayer } from './types';

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

  if (player === 'p1') {
    return player1Board;
  } else {
    return player2Board;
  }
};

export const hidePieceValues = (b1: IBoard, b2: IBoard): IBoard => {
  const combined: IBoard = {};
  for (const x in b1) { combined[x] = { name: 'unknown' }; }
  for (const y in b2) { combined[y] = { name: 'unknown' }; }
  return combined;
};
