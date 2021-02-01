import React from 'react';
import PropTypes from 'prop-types';

import styles from './Time.module.css';

const fixString = (time) => {
  return (time < 10)
    ? `0${time}`
    : time;
};

const propTypes = {
  minutes: PropTypes.number,
  seconds: PropTypes.number,
  deci: PropTypes.number
};

const Time = (props) => {
  const {
    minutes,
    seconds,
    deci
  } = props;

  const str = (!deci)
    ? `${fixString(minutes)}:${fixString(seconds)}`
    : `${fixString(minutes)}:${fixString(seconds)}.${deci}`;

  return (
    <div className={styles.time}>{str}</div>
  );
};

Time.propTypes = propTypes;

export default React.memo(Time);
