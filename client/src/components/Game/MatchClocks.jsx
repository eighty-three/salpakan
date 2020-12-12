import React, { useEffect, useContext, useReducer } from 'react';

import styles from './MatchClocks.module.css';
import Countdown from './Countdown';

import GameInfoContext from '@/lib/GameInfoContext';
import TurnChangeReducer from '@/lib/TurnChangeReducer';

const MatchClocks = () => {
  const gameInfo = useContext(GameInfoContext);
  const initialState = {
    turn: gameInfo?.turn,
    p1: {
      time: gameInfo?.p1.time,
      turn: gameInfo?.turn === gameInfo?.p1.name,
      css: (gameInfo?.turn === gameInfo?.p1.name)
        ? styles.time :
        `${styles.time} ${styles.fade}`
    },
    p2: {
      time: gameInfo?.p2.time,
      turn: gameInfo?.turn === gameInfo?.p2.name,
      css: (gameInfo?.turn === gameInfo?.p2.name)
        ? styles.time
        : `${styles.time} ${styles.fade}`
    }
  };

  const [ state, dispatch ] = useReducer(TurnChangeReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'update',
      payload: {
        turn: gameInfo?.turn,
        p1: gameInfo?.p1.name,
        p2:  gameInfo?.p2.name,
        p1Time: gameInfo?.p1.time,
        p2Time: gameInfo?.p2.time,
      }
    });
  }, [gameInfo?.turn]);

  const fn = (player, time, turn) => {
    if (turn && time > 0) {
      dispatch({ type: player, payload: { time: time - 1 } });
    }
  };

  return (
    <>
      { gameInfo &&
        <div className={styles.container}>
          <div className={state.p1.css}>
            <Countdown
              time={state.p1.time}
              counter={() => fn('p1', state.p1.time, state.p1.turn)}
              turn={state.p1.turn}
            />
          </div>
          <div className={state.p2.css}>
            <Countdown
              time={state.p2.time}
              counter={() => fn('p2', state.p2.time, state.p2.turn)}
              turn={state.p2.turn}
            />
          </div>
        </div>
      }
    </>
  );
};

export default MatchClocks;
