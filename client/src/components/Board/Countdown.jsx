import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Time from '@/components/Board/Time';

const propTypes = {
  counter: PropTypes.func,
  time: PropTypes.number
};

const Countdown = ({ counter, time }) => {
  const timeOut = useRef(null);
  useEffect(() => {
    timeOut.current = setTimeout(counter, 1000);
    return () => clearTimeout(timeOut.current);
  }, [time]);

  const remainingSecondsForMinutes = time % (60 * 60);
  const minutes = Math.floor(remainingSecondsForMinutes / 60);

  const remainingSeconds = remainingSecondsForMinutes % 60;
  const seconds = Math.ceil(remainingSeconds);

  return (
    <>
      {time &&
        <Time minutes={minutes} seconds={seconds} />
      }
    </>
  );
};

Countdown.propTypes = propTypes;

export default Countdown;
