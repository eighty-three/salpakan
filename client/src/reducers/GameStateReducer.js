const GameStateReducer = (state, action) => {
  switch (action.type) {
    case 'onGameStart': {
      /* Upon receiving the enemy's board, play sound
       *
       * Also, overwrite the board with unknown values with your own board
       * in order to differentiate between enemy pieces and your own
       */
      action.sound.move.play();

      return {
        socket: state.socket,
        gameInfo: {
          ...action.payload.data,
          [state.player]: {
            ...action.payload.data[state.player],
            pin: state.gameInfo.pin
          }
        },
        board: { ...action.payload.board, ...state.board },
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
          winner: action.payload.winner,
          positionHistory: action.payload.positionHistory
        },
        board: action.payload.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onPieceSetup': {
      const board = { ...state.board };
      const originValue = board[action.payload.origin];
      const destValue = board[action.payload.destination];

      const fixedBoard = {
        ...board,
        [action.payload.origin]: destValue,
        [action.payload.destination]: originValue
      };

      /* In the `fixedBoard` declaration above, what basically happens with
       * the origin and the destination is that they swap values.
       *
       * And then if `destValue` doesn't exist, it means the destination
       * was an empty space. Its key shouldn't remain in the new board
       */
      if (!destValue) delete fixedBoard[action.payload.origin];

      action.sound.move.play();

      return {
        socket: state.socket,
        gameInfo: state.gameInfo,
        board: fixedBoard,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onReady': {
      // For when the user submits his setup
      return {
        socket: state.socket,
        gameInfo: { ...state.gameInfo, setup: true },
        board: state.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onPieceMove': {
      /* For moves during the game itself. `turn` is set to null because
       * the countdown of both `MatchClock`s should be paused for the user.
       * While waiting for the move to be sent to the server to be processed,
       * the user's clock should not be ticking down. It's generally
       * unnoticeable; it's only a UX enhancement for slow networks.
       */
      return {
        socket: state.socket,
        gameInfo: state.gameInfo,
        board: state.board,
        turn: null,
        player: state.player
      };
    }

    case 'onSocketConnect': {
      // Sets the socket
      return {
        socket: action.payload.socket,
        gameInfo: state.gameInfo,
        board: state.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onSocketOpen': {
      /* Initial game state is received by the user. Sound is played to indicate
       * that the game (or the setup) has started.
       */
      action.sound.move.play();

      return {
        socket: state.socket,
        gameInfo: { ...action.payload.data },
        board: action.payload.board,
        turn: action.payload.turn,
        player: action.payload.player
      };
    }

    case 'onSocketClose': {
      // For cleanup or if something went wrong in the server
      return {
        socket: null,
        gameInfo: null,
        board: null,
        turn: undefined,
        player: null
      };
    }

    case 'onSocketMessageReadyResubmit': {
      /* For when the user resubmits the board
       *
       * It reverts back the board to the board first sent,
       * instead of what is currently in the client
       */
      return {
        socket: state.socket,
        gameInfo: state.gameInfo,
        board: action.payload.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onSocketMessageSpectate': {
      if (!action.payload.success) return state;

      return {
        ...state,
        gameInfo: { ...action.payload.data },
        board: action.payload.board
      };
    }

    case 'onSocketMessageTime': {
      /* Because of the disparity in time in the server and the client,
       * even if the time has ran out for the user, while it triggers a
       * message from the socket to the server, it doesn't automatically
       * mean that the player's time for the server is also 0. In that case,
       * what determines it is if there is a winner.
       *
       * If someone already won, that is, the time actually went to zero,
       * the user should receive the whole board with revealed pieces.
       * Otherwise, there shouldn't be any changes except for the time.
       */
      return (action.payload.data.winner)
        ? {
          socket: state.socket,
          gameInfo: { ...action.payload.data },
          board: action.payload.board,
          turn: state.turn,
          player: state.player
        } : {
          socket: state.socket,
          gameInfo: { ...action.payload.data },
          board: { ...action.payload.board, ...state.board },
          turn: state.turn,
          player: state.player
        };
    }

    case 'onSocketMessageBug': {
      /* Doesn't really trigger except if for some reason an illegal
       * move was sent to the server. If that's the case it just
       * essentially resets the state
       */
      return {
        socket: state.socket,
        gameInfo: { ...action.payload.data },
        board: state.board,
        turn: action.payload.turn,
        player: state.player
      };
    }

    case 'onSocketMessageSurrender': {
      // Game end, show the whole board and set the winner
      return {
        socket: state.socket,
        gameInfo: { ...action.payload.data },
        board: action.payload.board,
        turn: state.turn,
        player: state.player
      };
    }

    case 'onSocketMessageMove': {
      if (action.payload.data.winner) {
        return {
          socket: state.socket,
          gameInfo: { ...action.payload.data },
          board: action.payload.board,
          turn: state.turn,
          player: state.player
        };
      }

      const fixedBoard = { ...state.board };

      // if result === 1, the attacker should be placed in its destination
      if (action.payload.result === 1) {
        fixedBoard[action.payload.board.destination] = state.board[action.payload.board.origin];

      // else if result === 3, both pieces should be deleted so delete the destination
      } else if (action.payload.result === 3) {
        delete fixedBoard[action.payload.board.destination];
      }

      /* Implicit case where result === 2 where the action is just
       * `delete fixedBoard[res.board.origin];`
       *
       * Since no piece should be left in the origin, it should
       * always be deleted
       */
      delete fixedBoard[action.payload.board.origin];


      /* If there was originally something in the destination, meaning the
       * opponent had a piece there, the sound should play `ON_VS`.
       */
      const toPlay = (state.board[action.payload.board.destination])
        ? action.sound.vs
        : action.sound.move;

      toPlay.play();

      return {
        socket: state.socket,
        gameInfo: {
          ...action.payload.data,
          [state.player]: {
            ...action.payload.data[state.player],
            pin: state.gameInfo[state.player]?.pin
          }
        },
        board: { ...fixedBoard },
        turn: action.payload.turn,
        player: state.player
      };
    }
  }
};

export default GameStateReducer;
