import React, { useState, useEffect, useContext } from 'react';

import styles from './Setup.module.css';
import Countdown from './MatchClock/Countdown';

import GameStateContext from '@/lib/GameStateContext';

const Setup = () => {
  const [gameState] = useContext(GameStateContext);
  const [ time, setTime ] = useState(gameState.gameInfo?.time);
  const [ afk, setAfk ] = useState(false);
  const [ disabled, setDisabled ] = useState(false);

  useEffect(() => {
    setTime(gameState.gameInfo?.time);
  }, [gameState.gameInfo?.time]);

  const countDown = async () => {
    if (time > 0) {
      setTime(time - 1);
    } else if (time <= 0 && gameState.socket) {
      gameState.socket.send(JSON.stringify({ type: 'afk' }));
      setAfk(true);
    }
  };

  const onClickFn = () => {
    setDisabled(true);
    gameState.socket.send(JSON.stringify({ type: 'ready', message: gameState.board }));
  };

  return (
    <div className={styles.container}>
      { gameState.gameInfo &&
        <>
          <button className={styles.button} onClick={onClickFn} disabled={disabled}>
            Submit board
          </button>
          <div className={styles.clock}>
            <Countdown time={time} counter={countDown} />
          </div>
        </>
      }

      { afk &&
        <div className={styles.afk}>
          Your opponent was AFK, find another match
        </div>
      }
    </div>
  );
};

export default Setup;
