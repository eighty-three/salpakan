import React, { useState, useEffect, useContext } from 'react';

import styles from './Setup.module.css';
import Countdown from './MatchClock/Countdown';

import useButton from '@/hooks/useButton';
import GameStateContext from '@/contexts/GameStateContext';
import useDelay from '@/hooks/useDelay';

const Setup = () => {
  const [gameState, dispatch] = useContext(GameStateContext);
  const [time, setTime] = useState(gameState.gameInfo?.time);
  const [afk, setAfk] = useState(false);
  const [buttonState, setButtonState] = useButton('Submit Board');
  const [delay, clearDelay] = useDelay(3);

  useEffect(() => {
    // If afk
    if (afk) {
      const fn = async () => {

        // Wait 3 seconds
        await delay();

        // then refresh the page
        if (typeof window !== undefined) {
          window.location.reload();
        }
      };

      fn();
    }

    return () => {
      clearDelay();
    };
  }, [afk]);

  useEffect(() => {
    setTime(gameState.gameInfo?.time);
  }, [gameState.gameInfo?.time]);

  useEffect(() => {
    const bool = (gameState.gameInfo?.setup) ? true : false;
    setButtonState({ ...buttonState, disabled: bool });
  }, [gameState.gameInfo?.setup]);

  const countDown = async () => {
    if (time > 0) {
      setTime(time - 1);
    } else if (time <= 0 && gameState.socket) {
      gameState.socket.send(JSON.stringify({ type: 'afk' }));
      setAfk(true);
    }
  };

  const onClickFn = () => {
    if (!gameState.gameInfo?.setup) {
      setButtonState({ ...buttonState, disabled: true });
      dispatch({ type: 'onReady' });
      gameState.socket.send(JSON.stringify({ type: 'ready', message: gameState.board }));
    }
  };

  return (
    <div className={styles.container}>
      { afk
        ? (
          <div className={styles.afk}>
            Your opponent was AFK, find another match
          </div>
        ) : (
          <>
            { gameState.gameInfo &&
              <>
                <button className={styles.button} onClick={onClickFn} disabled={buttonState.disabled}>
                  {buttonState.text}
                </button>
                <div className={styles.clock}>
                  <Countdown time={time} counter={countDown} />
                </div>
              </>
            }
          </>
        )
      }
    </div>
  );
};

export default Setup;
