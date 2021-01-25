import ON_MOVE from '@/sounds/on_move.mp3';
import ON_VS from '@/sounds/on_vs.mp3';

const GameStateReducer = (state, action) => {
  const moveSound = new Audio(ON_MOVE);
  const vsSound = new Audio(ON_VS);

  switch (action.type) {
    case 'onGameStart': {
      /* Upon receiving the enemy's board, play sound
       *
       * Also, Overwrite the board with unknown values with your own board
       * in order to differentiate between enemy pieces and your own
       */
      moveSound.play();

      return {
        socket: state.socket,
        gameInfo: {...action.payload.data},
        board: {...action.payload.board, ...state.board},
        turn: action.payload.turn,
        player: state.player
      };
    }

    case 'onGameEnd': {
      /* On game end, replace state with the data sent from
       * the database
       */
      return {
        socket: state.socket,
        gameInfo: {
          p1: { name: action.payload.p1.name },
          p2: { name: action.payload.p2.name },
          winner: action.payload.winner
        },
        board: action.payload.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onPieceSetup': {
      const fixedBoard = {...state.board};
      const originValue = fixedBoard[action.payload.origin];
      const destValue = fixedBoard[action.payload.destination];

      const board = {
        ...fixedBoard,
        [action.payload.origin]: destValue,
        [action.payload.destination]: originValue
      };

      if (!destValue) delete board[action.payload.origin];

      moveSound.play();

      return {
        socket: state.socket,
        gameInfo: state.gameInfo,
        board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onPieceMove': {
      return {
        socket: state.socket,
        gameInfo: state.gameInfo,
        board: state.board,
        turn: null,
        player: state.player
      };
    }

    case 'onSocketConnect': {
      return {
        socket: action.payload.socket,
        gameInfo: state.gameInfo,
        board: state.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onSocketOpen': {
      return {
        socket: state.socket,
        gameInfo: {...action.payload.data},
        board: action.payload.board,
        turn: action.payload.turn,
        player: action.payload.player
      };
    }

    case 'onSocketClose': {
      return {
        socket: null,
        gameInfo: null,
        board: null,
        turn: undefined,
        player: null
      };
    }

    case 'onSocketMessageTime': {
      return (action.payload.data.winner)
        ? {
          socket: state.socket,
          gameInfo: {...action.payload.data},
          board: action.payload.board,
          turn: state.turn,
          player: state.player
        } : {
          socket: state.socket,
          gameInfo: {...action.payload.data},
          board: {...action.payload.board, ...state.board},
          turn: state.turn,
          player: state.player
        };
    }

    case 'onSocketMessageBug': {
      return {
        socket: state.socket,
        gameInfo: {...action.payload.data},
        board: state.board,
        turn: action.payload.turn,
        player: state.player
      };
    }

    case 'onSocketMessageMove': {
      if (action.payload.data.winner) {
        return {
          socket: state.socket,
          gameInfo: {...action.payload.data},
          board: action.payload.board,
          turn: state.turn,
          player: state.player
        };
      }

      const fixedBoard = {...state.board};
      delete fixedBoard[action.payload.board.origin];

      /* Implicit case where result === 2 where the action is
       * just `delete fixedBoard[res.board.origin];`
       */
      if (action.payload.result === 1) {
        fixedBoard[action.payload.board.destination] = state.board[action.payload.board.origin];
      } else if (action.payload.result === 3) {
        delete fixedBoard[action.payload.board.destination];
      }

      const toPlay = (state.board[action.payload.board.destination]) ? vsSound : moveSound;
      toPlay.play();

      return {
        socket: state.socket,
        gameInfo: {...action.payload.data},
        board: {...fixedBoard},
        turn: action.payload.turn,
        player: state.player
      };
    }
  }
};

export default GameStateReducer;
