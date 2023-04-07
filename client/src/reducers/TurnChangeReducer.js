import styles from '@/components/Game/MatchClock/index.module.css';

const TurnChangeReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      const playerTurn = (action.payload.turn === action.payload.player) ? true : false;

      return {
        turn: action.payload.turn,
        player: {
          time: action.payload.time,
          turn: playerTurn,
          css: playerTurn ? styles.player_info : `${styles.player_info} ${styles.fade}`
        }
      };
    }

    case 'time': {
      return { ...state, player: { ...state.player, time: action.payload.time }};
    }

    case 'pause': {
      return { ...state, turn: null, player: { ...state.player, turn: null }};
    }
  }
};

export default TurnChangeReducer;
