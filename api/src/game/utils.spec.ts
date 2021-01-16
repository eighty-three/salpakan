/* tslint:disable */
import { checkIfLegal, checkMove, cleanBoards } from './utils';
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

describe('testing checkMove', () => {
  const gameStates: IGameStates = {};

  describe('test basics', () => {
    const roomName = 'testroom1';

    const p1Board = {
      A1: { name: 'x', value: 1 },
      A2: { name: 'x', value: 1 }
    };

    const p2Board = {};

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

    test('to be 0, origin not owned by player', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'B1', 'B2')).toBe(0);
    });

    test('to be 0, destination is owned by player', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A1', 'A2')).toBe(0);
    });

    test('to be 1, player has the piece', () => {
      expect(gameStates[roomName].p1.board['A1']).toStrictEqual({name: 'x', value: 1});
      expect(gameStates[roomName].p1.board['B1']).toBe(undefined);

      expect(checkMove(gameStates, roomName, 'p1', 'A1', 'B1')).toBe(1);

      // piece has moved
      expect(gameStates[roomName].p1.board['A1']).toBe(undefined);
      expect(gameStates[roomName].p1.board['B1']).toStrictEqual({name: 'x', value: 1});
    });
  });

  describe('test vs', () => {
    const roomName = 'testroom2';

    const p1Board = {
      A1: { name: 'x', value: 1 },
      A2: { name: 'x', value: 1 },
      A3: { name: 'x', value: 99 },
      A4: { name: 'x', value: 5 },
      A5: { name: 'x', value: 5 },
      A6: { name: 'x', value: 2 }
    };

    const p2Board = {
      B1: { name: 'x', value: 1 },
      B2: { name: 'x', value: 2 },
      B3: { name: 'x', value: 2 },
      B4: { name: 'x', value: 4 },
      B5: { name: 'x', value: 10 },
      B6: { name: 'x', value: 99 }
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

    test('to be 3, result draw', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A1', 'B1')).toBe(3);
    });

    test('to be 2, d > o', () => {
      /* Example of impossible move in the client but valid in server.
       * Only for testing purposes, it should normally be impossible
       */
      expect(checkMove(gameStates, roomName, 'p1', 'A2', 'B2')).toBe(2);
    });

    test('to be 2, attacker is spy, target is private', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A3', 'B3')).toBe(2);
    });

    test('to be 1, o > d', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A4', 'B4')).toBe(1);
    });

    test('to be 1, o > d, empty space', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A5', 'C1')).toBe(1);
    });

    test('to be 1, attacker is private, target is spy', () => {
      expect(checkMove(gameStates, roomName, 'p1', 'A6', 'B6')).toBe(1);
    });
  });

  describe('test side effects', () => {
    const roomName = 'testroom3';

    const p1Board = {
      A1: { name: 'x', value: 1 },
      A2: { name: 'x', value: 1 },
      A3: { name: 'x', value: 99 },
      A4: { name: 'x', value: 5 },
      A5: { name: 'x', value: 5 },
      A6: { name: 'x', value: 2 }
    };

    const p2Board = {
      B1: { name: 'x', value: 1 },
      B2: { name: 'x', value: 2 },
      B3: { name: 'x', value: 2 },
      B4: { name: 'x', value: 4 },
      B5: { name: 'x', value: 10 },
      B6: { name: 'x', value: 99 }
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

    // re side effects, see utils.ts lines 197-222
  });

  describe('test modified boards', () => {
    const roomName = 'testroom4';

    const p1Board = {
      A1: { name: 'x', value: 1 },
      A2: { name: 'x', value: 1 },
      A3: { name: 'x', value: 99 },
      A4: { name: 'x', value: 5 },
      A5: { name: 'x', value: 5 },
      A6: { name: 'x', value: 2 }
    };

    const p2Board = {
      B1: { name: 'x', value: 1 },
      B2: { name: 'x', value: 2 },
      B3: { name: 'x', value: 2 },
      B4: { name: 'x', value: 4 },
      B5: { name: 'x', value: 10 },
      B6: { name: 'x', value: 99 }
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

    // re modified boards, see utils.ts lines 227-242
  });
});
