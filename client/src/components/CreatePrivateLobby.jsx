import React from 'react';
import PropTypes from 'prop-types';

import styles from './Buttons.module.scss';

import useButton from '@/hooks/useButton';
import { createLobby } from '@/lib/lobby';

const propTypes = {
  cookieValue: PropTypes.string
};

const CreatePrivateLobby = () => {
  const [buttonState, setButtonState] = useButton('Create Private Lobby');

  const onClickFn = async () => {
    setButtonState({ disabled: true, text: 'Creating...' });

    const req = await createLobby();
    if (req?.error) setButtonState({ disabled: false, text: 'Please try again' });
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

CreatePrivateLobby.propTypes = propTypes;

export default CreatePrivateLobby;
