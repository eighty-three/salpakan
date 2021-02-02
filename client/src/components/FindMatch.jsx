import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';

import styles from './Buttons.module.scss';

import useButton from '@/lib/useButton';

import ws from 'ws';
const WS = global.WebSocket || ws;
import { WS_HOST } from '@/lib/host';

const FindMatch = () => {
  const [buttonState, setButtonState] = useButton('Find Match');
  const timeOut = useRef(null);
  const [socket, setSocket] = useState(null);

  // proper cleanup after match is found
  useEffect(() => {
    return () => {
      if (timeOut.current) {
        clearTimeout(timeOut.current);
      }

      if (socket) {
        socket.close();
      }
    };
  }, []);

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Finding...' });

    const socketCn = new WS(`${WS_HOST}/ws/matchmaking`);

    socketCn.onclose = () => {
      clearTimeout(timeOut.current);
    };

    socketCn.onopen = () => {
      setSocket(socketCn);
      socketCn.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
    };

    socketCn.onmessage = async (message) => {
      const data = message.data;

      // room name cannot be 'pong' because of schema (10 characters length)
      if (data !== 'pong') {
        clearTimeout(timeOut.current);

        socketCn.close();
        setButtonState({ disabled: true, text: 'Match found!' });
        Router.push(`/game/${data}`);
      } else {

        // send back a 'ping' after a minute
        const delay = () => new Promise(resolve => {
          timeOut.current = setTimeout(resolve, 60000);
        });

        await delay();
        socketCn.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
      }
    };

    socketCn.onerror = () => {
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
