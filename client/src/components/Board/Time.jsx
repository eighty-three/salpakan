import React from 'react';

import PropTypes from 'prop-types';

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

  const str = (minutes || seconds > 9)
    ? `${fixString(minutes)}:${fixString(seconds)}`
    : `${fixString(minutes)}:${fixString(seconds)}.${deci}`;

  return (
    <>
      <p>{str}</p>
    </>
  );
};

Time.propTypes = propTypes;

export default Time;
