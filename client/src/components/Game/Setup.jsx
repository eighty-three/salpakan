import React, { useState, useEffect, useContext } from 'react';

import styles from './Setup.module.css';
import Countdown from './MatchClock/Countdown';

import GameInfoContext from '@/lib/GameInfoContext';
import SocketContext from '@/lib/SocketContext';

const Setup = () => {
  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const [ time, setTime ] = useState(gameInfo?.time);
  const [ afk, setAfk ] = useState(false);
  const [ disabled, setDisabled ] = useState(false);

  useEffect(() => {
    setTime(gameInfo?.time);
  }, [gameInfo?.time]);

  const countDown = async () => {
    if (time > 0) {
      setTime(time - 1);
    } else if (time <= 0 && socket) {
      socket.send(JSON.stringify({ type: 'afk' }));
      setAfk(true);
    }
  };

  const onClickFn = () => {
    setDisabled(true);
    socket.send(JSON.stringify({ type: 'ready' }));
  };

  return (
    <div className={styles.container}>
      { gameInfo &&
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
