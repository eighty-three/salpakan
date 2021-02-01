import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onClickFn: PropTypes.func
};

import styles from './Buttons.module.scss';
import useButton from '@/lib/useButton';

const Surrender = (props) => {
  const {
    onClickFn
  } = props;

  const [buttonState] = useButton('Surrender');

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
