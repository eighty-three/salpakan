import React from 'react';
import PropTypes from 'prop-types';

import buttonStyle from '@/styles/Buttons.module.scss';

import useButton from '@/hooks/useButton';

import { WS_HOST } from '@/lib/host';
import ws from 'ws';
const WS = global.WebSocket || ws;

const propTypes = {
  id: PropTypes.string
};

const Rematch = (props) => {
  const {
    id
  } = props;

  const [buttonState, setButtonState] = useButton('Rematch');

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

Rematch.propTypes = propTypes;

export default Rematch;
