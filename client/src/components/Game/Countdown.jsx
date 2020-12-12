import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as workerTimers from 'worker-timers';

import Time from './Time';

const propTypes = {
  counter: PropTypes.func,
  time: PropTypes.number,
  turn: PropTypes.bool
};

const Countdown = (props) => {
  const {
    counter,
    time,
    turn
  } = props;

  const timeOut = useRef(null);
  useEffect(() => {
    timeOut.current = workerTimers.setTimeout(counter, 100);
    return () => workerTimers.clearTimeout(timeOut.current);
  }, [time, turn]);
  /* `turn` dependency included for MatchClocks. Still works
   * as intended in SetupPanel because it'll be null there
   */

  const currentTime = new Date(time * 100);
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const deci = Math.trunc(currentTime.getMilliseconds() / 100);

  return (
    <>
      {time > 0 &&
        <>
          <Time minutes={minutes} seconds={seconds} deci={deci} />
        </>
      }
    </>
  );
};

Countdown.propTypes = propTypes;

export default Countdown;
