import React from 'react';
import Router from 'next/router';

import styles from './Buttons.module.scss';

import useButton from '@/lib/useButton';

import ws from 'ws';
const WS = global.WebSocket || ws;
import { WS_HOST } from '@/lib/host';

const FindMatch = () => {
  const [buttonState, setButtonState] = useButton('Find Match');

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Finding...' });

    const socket = new WS(`${WS_HOST}/ws/matchmaking`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
    };

    socket.onmessage = async (message) => {
      const data = message.data;

      // room name cannot be 'pong' because of schema (10 characters length)
      if (data !== 'pong') {
        socket.close();
        setButtonState({ disabled: true, text: 'Match found!' });
        Router.push(`/game/${data}`);
      } else {

        // send back a 'ping' after a minute
        const delay = () => new Promise(resolve => {
          setTimeout(resolve, 60000);
        });

        await delay();
        socket.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
      }
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
        className={`${styles.button} ${styles.l}`}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

export default FindMatch;
