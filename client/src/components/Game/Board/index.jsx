import React, { useState, useEffect, useContext } from 'react';

import styles from './index.module.css';
import Piece from './Piece';

import GameInfoContext from '@/lib/GameInfoContext';
import SocketContext from '@/lib/SocketContext';
import UserContext from '@/lib/UserContext';

const Board = () => {
  const gameInfo = useContext(GameInfoContext);
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const [ board, setBoard ] = useState({});

  useEffect(() => {
    setBoard(gameInfo?.gameState);
  }, [gameInfo?.gameState]);

  const moveFn = () => {
    // Temporary to simulate moves. It should be attached to the Piece components
    if (user === gameInfo.turn) {
      socket.send(JSON.stringify({ type: 'move' }));
    }
  };

  return (
    <>
      <div className={`${styles.board}`}>
        { board &&
          <>
            <button onClick={moveFn}>Emulate Move</button>
            <>
              {Object.keys(board).map((key) => (
                <Piece
                  key={key}
                  name={board[`${key}`].name}
                />
              ))}
            </>
          </>
        }
      </div>
    </>
  );
};

export default Board;
