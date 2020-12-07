import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Panel from './Panel';
import SetupPanel from './SetupPanel';

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

  const [ socket, setSocket] = useState(null);
  const [ board, setBoard ] = useState(null);
  const [ gameInfo, setGameInfo ] = useState(null);

  useEffect(() => {
    if (state.ongoing) {
      setSocket(connectToGame(id, setBoard, setGameInfo));
    } else {
      setBoard(state);
    }
  }, [state]);

  return (
    <>
      <GameInfoContext.Provider value={gameInfo}>
        <SocketContext.Provider value={socket}>
          {(gameInfo?.turn !== undefined)
            ? (<Panel />)
            : (<SetupPanel />)
          }

          { board &&
            <div className={`${styles.board}`}>
              <>
                {Object.keys(board).map((key) => (
                  <div key={key} className={board[`${key}`].name}>
                    {board[`${key}`].name}
                  </div>
                ))}
              </>
            </div>
          }
        </SocketContext.Provider>
      </GameInfoContext.Provider>
    </>
  );
};

Board.propTypes = propTypes;

export default Board;
