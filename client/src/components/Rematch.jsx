import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string
};

import styles from './Buttons.module.scss';

import { WS_HOST } from '@/lib/host';
import ws from 'ws';
const WS = global.WebSocket || ws;

const Rematch = (props) => {
  const {
    id
  } = props;

  const [ buttonState, setButtonState ] = useState({
    disabled: true,
    text: 'Rematch'
  });

  useEffect(() => {
    setButtonState({...buttonState, disabled: false });
  }, []);

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Waiting for your opponent...' });

    const socket = new WS(`${WS_HOST}/ws/rematch/${id}`);

    socket.onmessage = (message) => {
      const data = message.data;

      socket.close();
      setButtonState({ disabled: true, text: 'Rematch!' });

      // Router.push doesn't refresh the page properly
      window.location.replace(`/game/${data}`);
    };

    socket.onerror = () => {
      setButtonState({ disabled: true , text: 'Something went wrong' });
    };
  };

  return (
    <div className={styles.container}>
      <button
        onClick={onClickFn}
        disabled={buttonState.disabled}
        className={`${styles.button} ${styles.l}`}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

Rematch.propTypes = propTypes;

export default Rematch;
