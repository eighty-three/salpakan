import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from './Buttons.module.scss';

import { createLobby } from '@/lib/lobby';

const propTypes = {
  cookieValue: PropTypes.string
};

const CreateLobbyButton = (props) => {
  const {
    cookieValue
  } = props;

  const [ buttonState, setButtonState ] = useState({
    disabled: false,
    text: 'Create Private Lobby'
  });

  const onClickFn = (auth) => {
    if (auth) {
      setButtonState({ disabled: true, text: 'Creating...' });
      createLobby(setButtonState);
    } else {
      setButtonState({ disabled: false, text: 'Please try again' });
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => onClickFn(cookieValue)}
        disabled={buttonState.disabled}
        className={styles.button}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

CreateLobbyButton.propTypes = propTypes;

export default CreateLobbyButton;
