import styles from '@/components/Game/MatchClocks.module.css';

const TurnChangeReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      const p1Turn = (action.payload.turn === action.payload.p1) ? true : false;

      return {
        turn: action.payload.turn,
        p1: {
          time: action.payload.p1Time,
          turn: p1Turn,
          css: p1Turn ? styles.player_info : `${styles.player_info} ${styles.fade}`
        },
        p2: {
          time: action.payload.p2Time,
          turn: !p1Turn,
          css: !p1Turn ? styles.player_info : `${styles.player_info} ${styles.fade}`
        }
      };
    }

    case 'p1': {
      return {...state, p1: { ...state.p1, time: action.payload.time }};
    }

    case 'p2': {
      return {...state, p2: { ...state.p2, time: action.payload.time }};
    }
  }
};

export default TurnChangeReducer;
