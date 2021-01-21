/* tslint:disable */
import { checkMove, cleanBoards, movePiece } from './utils';
import { IGameStates } from './types';

describe('testing checkIfLegal', () => {
  /* Add tests here
   *
   * Test different kinds of input:
   * integer (1, 2)
   * incomplete args ('A1')
   * same input ('A1', 'A1')
   * horizontal movement ('A1', 'B1')
   * vertical movement ('A1', 'A2')
   * diagonal ('A1', 'B2')
   * jumps ('A1', 'A3') or ('A1', 'C1')
   * non-coordinate ('A1', 'X1') or ('A9', 'A8') or ('I1', 'J1')
   */
});

/* Limitations for `checkMove`:
 * 'A1' to 'C1' is considered a valid move if it passes the checks in the function.
 * The check for the 'legality' of the move is done both in the client and the server,
 * so it should be impossible for something like 'A1' and 'C1' to be sent as arguments
 *
 * Also, the tests are written with A1 to A8 as columns but that's clearly wrong
 * because it should be A1 to I1. It's fixed in the `getInitialBoardState` function.
 * I can't be arsed to fix it in here though since it's irrelevant to the function
 */

describe('checkMove', () => {
  const gameStates: IGameStates = {};
  const roomName = 'testRoom';

  beforeEach(() => {
    const p1Board = {
      A1: { name: 'x', value: 1 },
      A2: { name: 'x', value: 1 },
      A5: { name: 'x', value: 99 },
      B3: { name: 'x', value: 5 },
      B5: { name: 'x', value: 5 },
      C2: { name: 'x', value: 5 },
      D3: { name: 'x', value: 5 },
      H5: { name: 'x', value: 2 },
      I5: { name: 'x', value: 2 }
    };

    const p2Board = {
      A6: { name: 'x', value: 2 },
      A8: { name: 'x', value: 1 },
      A7: { name: 'x', value: 2 },
      B6: { name: 'x', value: 2 },
      D6: { name: 'x', value: 2 },
      E6: { name: 'x', value: 4 },
      F5: { name: 'x', value: 4 },
      H6: { name: 'x', value: 2 },
      H8: { name: 'x', value: 10 },
      I6: { name: 'x', value: 99 }
    };

    const { board1, board2, bothBoards } = cleanBoards(p1Board, p2Board);

    gameStates[roomName] = {
      playerList: ['p1', 'p2'], turn: 'p1', start: true, lastMove: 1, time: 1, winner: null,
      board: {...bothBoards},
      p1: {
        time: 1, start: true, name: 'p1',
        board: {...board1}
      },
      p2: {
        time: 1, start: true, name: 'p2',
        board: {...board2}
      }
    };
  });

  describe('pre-requisites', () => {
    test('it returns 0 when the origin is owned by the opponent', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A8', 'A7')).toEqual(0);
    });

    test('it returns 0 when the destination is owned by the player', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A1', 'A2')).toEqual(0);
    });
  });

  describe('piece movement', () => {
    test('it returns 3 (draw) when o === d', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'H5', 'H6')).toEqual(3);
    });

    test('edge case: it returns 2 when d > o, given that d and o are at either ends of the board', () => {
      /* Example of impossible move in the client but valid in server.
       * Only for testing purposes, it should normally be impossible
       */
      expect(checkMove(gameStates, roomName, 'p1', 'A2', 'I6')).toEqual(2);
    });

    test('it returns 2 when attacker is spy, target is a private', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A5', 'A6')).toEqual(2);
    });

    test('it returns 2, attacker is spy, target is not a private', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A5', 'A6')).toEqual(2);
    });

    test('it returns 1 when o > d', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'B5', 'B6')).toEqual(1);
    });

    test('it returns 1 when o > d, where d is an empty space', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'D3', 'D4')).toEqual(1);
    });

    test('it returns 1 when attacker is private, target is spy', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'I5', 'I6')).toEqual(1);
    });

    test('it returns 2 when attacker is private, target is not a spy', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'I5', 'F5')).toEqual(2);
    });
  });
});

describe('movePiece', () => {
  const gameStates: IGameStates = {};
  const roomName = 'testroom4';

  beforeEach(()=> {
    const p1Board = {
      A1: { name: 'foo', value: 1 },
      A2: { name: 'bar', value: 1 },
      A3: { name: 'baz', value: 99 },
      A4: { name: 'moo', value: 5 },
      A5: { name: 'cat', value: 5 },
      A6: { name: 'sta', value: 2 }
    };

    const p2Board = {
      B1: { name: 'bar', value: 1 },
      B2: { name: 'bar', value: 2 },
      B3: { name: 'bar', value: 2 },
      B4: { name: 'bar', value: 4 },
      B5: { name: 'bar', value: 10 },
      B6: { name: 'bar', value: 99 }
    };

    const {board1, board2, bothBoards} = cleanBoards(p1Board, p2Board);

    gameStates[roomName] = {
      playerList: ['p1', 'p2'], turn: 'p1', start: true, lastMove: 1, time: 1, winner: null,
      board: {...bothBoards},
      p1: {
        time: 1, start: true, name: 'p1',
        board: {...board1}
      },
      p2: {
        time: 1, start: true, name: 'p2',
        board: {...board2}
      }
    };
  });

  describe('when result is 1', () => {
    test('it updates all boards with the destination, and deletes the origin.', () => {
      movePiece(
        gameStates[roomName].board,
        gameStates[roomName].p1.board,
        gameStates[roomName].p2.board,
        'A2',
        'A3',
        1);
      expect(gameStates[roomName].p1.board['A3']).toEqual({ name: 'bar', value: 1 });
      expect(gameStates[roomName].p2.board['A3']).toEqual({ name: 'unknown'});

      expect(gameStates[roomName].p1.board['A2']).toBeUndefined();
      expect(gameStates[roomName].p2.board['A2']).toBeUndefined();
      expect(gameStates[roomName].board['A2']).toBeUndefined();
    });
    test('it sets the destination value to \'undefined\' when origin doesnt exist.', () => {
      movePiece(
        gameStates[roomName].board,
        gameStates[roomName].p1.board,
        gameStates[roomName].p2.board,
        'A7',
        'A6',
        1);

      expect(gameStates[roomName].p1.board['A7']).toBeUndefined();
      expect(gameStates[roomName].p2.board['A7']).toBeUndefined();
    });
  });
  describe('when result is 3', () => {
    test('it deletes the destination and origin from all boards.', () => {
      movePiece(
        gameStates[roomName].board,
        gameStates[roomName].p1.board,
        gameStates[roomName].p2.board,
        'A2',
        'A3',
        3);

      expect(gameStates[roomName].p1.board['A2']).toBeUndefined();
      expect(gameStates[roomName].p2.board['A2']).toBeUndefined();
      expect(gameStates[roomName].board['A2']).toBeUndefined();

      expect(gameStates[roomName].p1.board['A3']).toBeUndefined();
      expect(gameStates[roomName].p2.board['A3']).toBeUndefined();
      expect(gameStates[roomName].board['A3']).toBeUndefined();
    });
  });
  describe('when result is 2', () => {
    test('it deletes the origin from all boards.', () => {
      movePiece(
        gameStates[roomName].board,
        gameStates[roomName].p1.board,
        gameStates[roomName].p2.board,
        'A2',
        'A3',
        2);

      expect(gameStates[roomName].p1.board['A2']).toBeUndefined();
      expect(gameStates[roomName].p2.board['A2']).toBeUndefined();
      expect(gameStates[roomName].board['A2']).toBeUndefined();
    });

    test('it doesnt throw an error when the origin doesnt exist', () => {
      expect(movePiece(
        gameStates[roomName].board,
        gameStates[roomName].p1.board,
        gameStates[roomName].p2.board,
        'A7',
        'A3',
        2)).not.toThrowError;
    });
  });
});