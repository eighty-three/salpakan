import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './Buttons.module.scss';

import { createLobby } from '@/lib/lobby';

const propTypes = {
  cookieValue: PropTypes.string
};

const CreatePrivateLobby = (props) => {
  const {
    cookieValue
  } = props;

  const [ buttonState, setButtonState ] = useState({
    disabled: true,
    text: 'Create Private Lobby'
  });

  useEffect(() => {
    setButtonState({...buttonState, disabled: false });
  }, []);


  const onClickFn = async (auth) => {
    if (auth) {
      setButtonState({ disabled: true, text: 'Creating...' });

      const req = await createLobby();
      if (req?.error) setButtonState({ disabled: false, text: 'Please try again' });
    } else {
      setButtonState({ disabled: false, text: 'Please try again' });
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => onClickFn(cookieValue)}
        disabled={buttonState.disabled}
        className={`${styles.button} ${styles.l}`}
      >
        {buttonState.text}
      </button>
    </div>
  );
};

CreatePrivateLobby.propTypes = propTypes;

export default CreatePrivateLobby;
