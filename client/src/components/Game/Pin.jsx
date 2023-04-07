import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import styles from './Pin.module.scss';
import buttonStyle from '@/styles/Buttons.module.scss';
import GameStateContext from '@/contexts/GameStateContext';

const propTypes = {
  player: PropTypes.string,
  pin: PropTypes.string
};

const PlayerPin = ({
  player,
  pin = ''
}) => {
  const [gameState] = useContext(GameStateContext);
  const [show, setShow] = useState(false);
  const [playerPin, setPin] = useState(pin);
  const { register, handleSubmit } = useForm();

  const id = `${player}_form`;

  useEffect(() => {
    setPin(pin);
  }, [pin]);

  const onSubmit = (data) => {
    gameState.socket.send(JSON.stringify({
      type: 'spectate',
      player,
      pin: data[id].toUpperCase()
    }));

    setShow(false);
  };

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);

  return (
    <>
      { pin
        ? (
          <>
            { gameState.player
              ? <p>{pin}</p>
              : <p>Spectating</p>
            }
          </>
        ) : (
          <>
            { !gameState.player &&
              <>
                { show
                  ? (
                    <>
                      <div
                        onClick={hideModal}
                        className={styles.modalBG}
                      />

                      <form
                        className={`${styles.form} ${styles.modal}`}
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <input
                          className={styles.input}
                          type="text"
                          maxLength={5}
                          pattern="[a-hA-H0-9]{5}"
                          placeholder="[A-H0-9]{5}"
                          spellCheck="false"
                          aria-describedby={id}
                          id={id}
                          name={id}
                          value={playerPin}
                          {...register(id, {
                            required: true
                          })}
                        />
                        <button
                          type={'submit'}
                          className={`${buttonStyle.button} ${buttonStyle.long_s}`}
                        >
                          Enter PIN
                        </button>
                      </form>
                    </>
                  ) : (
                    <button
                      onClick={showModal}
                      className={`${buttonStyle.button} ${buttonStyle.long_s}`}
                    >
                      Spectate
                    </button>
                  )
                }
              </>
            }
          </>
        )
      }
    </>
  );
};

PlayerPin.propTypes = propTypes;
export default PlayerPin;
