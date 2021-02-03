import React, { useEffect, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Countdown from './Countdown';

import TurnChangeReducer from '@/reducers/TurnChangeReducer';
import GameStateContext from '@/contexts/GameStateContext';

const propTypes = {
  playerNum: PropTypes.string
};

const Player = (props) => {
  const {
    playerNum
  } = props;

  const [gameState] = useContext(GameStateContext);

  const initialState = {
    turn: gameState.turn,
    player: {
      time: gameState.gameInfo?.[playerNum].time,
      turn: gameState.turn === playerNum,
      css: (gameState.turn === playerNum)
        ? ''
        : styles.fade
    }
  };

  const [state, dispatch] = useReducer(TurnChangeReducer, initialState);

  useEffect(() => {
    if (gameState.turn) {
      dispatch({ type: 'update',
        payload: {
          turn: gameState.turn,
          player: playerNum,
          time: gameState.gameInfo?.[playerNum].time,
        }
      });
    } else {
      dispatch({ type: 'pause' });
    }
  }, [gameState.turn, gameState.gameInfo?.[playerNum]?.time]);

  const fn = (time, turn) => {
    if (turn && time > 0) {
      dispatch({ type: 'time', payload: { time: time - 1 }});
    } else if (time <= 0) {
      gameState.socket.send(JSON.stringify({ type: 'time', message: playerNum }));
    }
  };

  return (
    <>
      { gameState.gameInfo &&
        <div className={styles.container}>
          <div className={state?.player.css}>
            <Countdown
              time={state?.player.time}
              counter={() => fn(state?.player.time, state?.player.turn)}
              turn={state?.player.turn}
            />
          </div>
        </div>
      }
    </>
  );
};

Player.propTypes = propTypes;

export default Player;
