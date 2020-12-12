import React, { useState, useEffect, useContext } from 'react';

import Countdown from './Countdown';

import GameInfoContext from '@/lib/GameInfoContext';
import SocketContext from '@/lib/SocketContext';

const SetupPanel = () => {
  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const [ time, setTime ] = useState(6000);
  const [ afk, setAfk ] = useState(false);
  const [ disabled, setDisabled ] = useState(false);

  useEffect(() => {
    setTime(gameInfo?.time - Math.floor(Date.now() / 100));
    // Data from server is deciseconds so deduct in deciseconds
  }, [gameInfo?.time]);

  const countDown = async () => {
    if (time > 0) {
      setTime(time - 1);
    } else if (time <= 0 && socket) {
      socket.send(JSON.stringify({ type: 'afk' }));
      setAfk(true);
    }
  };

  const onClickFn = () => {
    setDisabled(true);
    socket.send(JSON.stringify({ type: 'ready' }));
  };

  return (
    <>
      { gameInfo &&
        <>
          <Countdown time={time} counter={countDown} />
          <button onClick={onClickFn} disabled={disabled}>Submit board</button>
        </>
      }

      { afk &&
        <p>Your opponent was AFK. Find another match</p>
      }
    </>
  );
};

export default SetupPanel;
