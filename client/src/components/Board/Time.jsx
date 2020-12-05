import React from 'react';

import PropTypes from 'prop-types';

const fixString = (time) => {
  return (time < 10)
    ? `0${time}`
    : time;
};

const propTypes = {
  minutes: PropTypes.number,
  seconds: PropTypes.number
};

const Time = (props) => {
  const {
    minutes,
    seconds
  } = props;

  return (
    <p>{fixString(minutes)}:{fixString(seconds)}</p>
  );
};

Time.propTypes = propTypes;

export default Time;
