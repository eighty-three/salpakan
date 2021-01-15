import React, { useEffect, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Countdown from './Countdown';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import TurnChangeReducer from '@/lib/TurnChangeReducer';

const propTypes = {
  playerNum: PropTypes.string
};

const Player = (props) => {
  const {
    playerNum
  } = props;

  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const turn = useContext(TurnContext);

  const initialState = {
    turn,
    player: {
      time: gameInfo?.[playerNum].time,
      turn: turn === gameInfo?.[playerNum].name,
      css: (turn === gameInfo?.[playerNum].name)
        ? ''
        : styles.fade
    }
  };

  const [ state, dispatch ] = useReducer(TurnChangeReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'update',
      payload: {
        turn,
        player: gameInfo?.[playerNum].name,
        time: gameInfo?.[playerNum].time,
      }
    });
  }, [turn]);

  const fn = (time, turn) => {
    if (turn && time > 0) {
      dispatch({ type: 'time', payload: { time: time - 1 } });
    } else if (time === 0) {
      socket.send(JSON.stringify({ type: 'time', message: playerNum }));
    }
  };

  return (
    <>
      { gameInfo &&
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
