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
    timeOut.current = workerTimers.setTimeout(counter, 92.5);
    return () => workerTimers.clearTimeout(timeOut.current);
  }, [time, turn]);
  /* `turn` dependency included for MatchClocks. Still works
   * as intended in SetupPanel because it'll be null there
   *
   * The interval is set at 92.5 because if it's set to 100, it's too slow
   * compared to the time from the server. Every 15 seconds, it lags behind
   * an extra second compared to server time. At 90, the client countdown
   * becomes too fast. At 92.5, it gets delayed by a second every 1 minute
   * and 30 seconds. Until I can come up with a more exact method to count
   * the time without constantly badgering the server (unless it's not that
   * big of a deal?) this is sufficient because if you're playing the game
   * "legitimately", there's no way you'll spend more than 30 seconds, or
   * maybe even 20 seconds each turn. Let's just say that the game is meant
   * to be played fast. "It's not a bug, it's a feature"
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
