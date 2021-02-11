import React, { useState, useEffect, useContext } from 'react';

import styles from './Setup.module.css';
import buttonStyle from '@/styles/Buttons.module.scss';
import Countdown from './MatchClock/Countdown';

import useButton from '@/hooks/useButton';
import GameStateContext from '@/contexts/GameStateContext';

const Setup = () => {
  const [gameState, dispatch] = useContext(GameStateContext);
  const [time, setTime] = useState(gameState.gameInfo?.time);
  const [afk, setAfk] = useState(false);
  const [buttonState, setButtonState] = useButton('Submit Board');

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
                <button
                  className={`${buttonStyle.button} ${buttonStyle.long_s}`}
                  onClick={onClickFn}
                  disabled={buttonState.disabled}
                >
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
