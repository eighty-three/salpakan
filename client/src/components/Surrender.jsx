import React from 'react';
import PropTypes from 'prop-types';

import buttonStyle from '@/styles/Buttons.module.scss';

import useButton from '@/hooks/useButton';

const propTypes = {
  onClickFn: PropTypes.func
};

const Surrender = (props) => {
  const {
    onClickFn
  } = props;

  const [buttonState] = useButton('Surrender');

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

Surrender.propTypes = propTypes;

export default Surrender;
