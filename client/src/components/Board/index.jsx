import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Panel from './Panel';
import Countdown from './Countdown';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import { connectToGame } from '@/lib/game';

const propTypes = {
  id: PropTypes.string,
  state: PropTypes.object
};

const Board = (props) =>{
  const {
    id,
    state
  } = props;
  const [ board, setBoard ] = useState(null);
  const [ socket, setSocket] = useState(null);
  const [ gameInfo, setGameInfo ] = useState(null);
  const [ time, setTime ] = useState(0);

  const countDown = async () => {
    if (time > 0) {
      setTime(time - 1);
    }
  };

  useEffect(() => {
    if (state.ongoing) {
      setSocket(connectToGame(id, setBoard, setGameInfo, setTime));
    } else {
      setBoard(state);
    }
  }, [state]);

  return (
    <>
      <GameInfoContext.Provider value={gameInfo}>
        {(gameInfo?.turn !== undefined)
          ? (<Panel />)
          : (<Countdown time={time} counter={countDown} />)
        }
        <SocketContext.Provider value={socket}>
          <div className={`${styles.board}`}>
            { board &&
              <>
                {Object.keys(board).map((key) => (
                  <div key={key} className={board[`${key}`].name}>
                    {board[`${key}`].name}
                  </div>
                ))}
              </>
            }
          </div>
        </SocketContext.Provider>
      </GameInfoContext.Provider>
    </>
  );
};

Board.propTypes = propTypes;

export default Board;
