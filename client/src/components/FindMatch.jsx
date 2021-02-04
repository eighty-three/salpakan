import React, { useState, useEffect } from 'react';
import Router from 'next/router';

import buttonStyle from '@/styles/Buttons.module.scss';

import useButton from '@/hooks/useButton';
import useDelay from '@/hooks/useDelay';

import ws from 'ws';
const WS = global.WebSocket || ws;
import { WS_HOST } from '@/lib/host';

const FindMatch = () => {
  const [buttonState, setButtonState] = useButton('Find Match');
  const [delay, clearDelay] = useDelay(60);
  const [socket, setSocket] = useState(null);

  // proper cleanup after match is found
  useEffect(() => {
    return () => {
      clearDelay();

      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Finding...' });

    const socketCn = new WS(`${WS_HOST}/ws/matchmaking`);

    socketCn.onclose = () => {
      clearDelay();
    };

    socketCn.onopen = () => {
      setSocket(socketCn);
      socketCn.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
    };

    socketCn.onmessage = async (message) => {
      const data = message.data;
      clearDelay();

      // room name cannot be 'pong' because of schema (10 characters length)
      if (data !== 'pong') {
        socketCn.close();
        setButtonState({ disabled: true, text: 'Match found!' });
        Router.push(`/game/${data}`);
      } else {
        await delay();
        socketCn.send(JSON.stringify({ type: 'keepalive', message: 'ping' }));
      }
    };

    socketCn.onerror = () => {
      setButtonState({ disabled: true , text: 'Please try again' });
    };
  };

  return (
    <div className={buttonStyle.container}>
      <button
        onClick={onClickFn}
        disabled={buttonState.disabled}
        className={`${buttonStyle.button} ${buttonStyle.l}`}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

export default FindMatch;
