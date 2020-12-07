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
    timeOut.current = workerTimers.setTimeout(counter, 100);
    return () => workerTimers.clearTimeout(timeOut.current);
  }, [time]);

  const currentTime = new Date(time * 100);
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const deci = currentTime.getMilliseconds() / 100;

  return (
    <>
      {time > 0 &&
        <Time minutes={minutes} seconds={seconds} deci={deci} />
      }
    </>
  );
};

Countdown.propTypes = propTypes;

export default Countdown;
