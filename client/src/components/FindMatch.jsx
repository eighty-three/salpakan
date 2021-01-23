import React, { useState } from 'react';
import Router from 'next/router';

import styles from './Buttons.module.scss';

import ws from 'ws';
const WS = global.WebSocket || ws;
import { WS_HOST } from '@/lib/host';

const FindMatch = () => {
  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Find Match' });

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Finding...' });

    const socket = new WS(`${WS_HOST}/ws/matchmaking`);

    socket.onmessage = (message) => {
      const data = message.data;
      socket.close();
      setButtonState({ disabled: true, text: 'Match found!' });
      Router.push(`/game/${data}`);
    };

    socket.onerror = () => {
      setButtonState({ disabled: true , text: 'Please try again' });
    };
  };

  return (
    <div className={styles.container}>
      <button
        onClick={onClickFn}
        disabled={buttonState.disabled}
        className={styles.button}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

export default FindMatch;
