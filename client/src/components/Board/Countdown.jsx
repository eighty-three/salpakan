import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as workerTimers from 'worker-timers';

import Time from '@/components/Board/Time';

const propTypes = {
  counter: PropTypes.func,
  time: PropTypes.number
};

const Countdown = ({ counter, time }) => {
  const timeOut = useRef(null);
  useEffect(() => {
    timeOut.current = workerTimers.setTimeout(counter, 1000);

    return () => workerTimers.clearTimeout(timeOut.current);
  }, [time]);

  const currentTime = new Date(time * 1000);
  const seconds = currentTime.getSeconds();

  const remainingSecondsForMinutes = time % (60*60);
  const minutes = Math.floor(remainingSecondsForMinutes / 60);

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
