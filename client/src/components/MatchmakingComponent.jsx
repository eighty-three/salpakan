import React, { useState } from 'react';

import styles from './Buttons.module.scss';

import { findMatch } from '@/lib/matchmaking';

const FindGameButton = () => {
  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Find Match' });

  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Finding...' });
    findMatch(setButtonState);
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

export default FindGameButton;
