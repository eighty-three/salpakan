import React from 'react';
import PropTypes from 'prop-types';

import buttonStyle from '@/styles/Buttons.module.scss';

import useButton from '@/hooks/useButton';
import { createBotGame } from '@/lib/bot';

const propTypes = {
  cookieValue: PropTypes.string
};

const PlayAgainstBot = () => {
  const [buttonState, setButtonState] = useButton('Play Against Bot');

  const onClickFn = async () => {
    setButtonState({ disabled: true, text: 'Creating...' });

    const req = await createBotGame();
    if (req?.error) setButtonState({ disabled: false, text: 'Please try again' });
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

PlayAgainstBot.propTypes = propTypes;

export default PlayAgainstBot;
