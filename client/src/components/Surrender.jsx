import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onClickFn: PropTypes.func
};

import styles from './Buttons.module.scss';

const Surrender = (props) => {
  const {
    onClickFn
  } = props;

  const [ buttonState, setButtonState ] = useState({
    disabled: true,
    text: 'Surrender'
  });

  useEffect(() => {
    setButtonState({...buttonState, disabled: false });
  }, []);

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

Surrender.propTypes = propTypes;

export default Surrender;
