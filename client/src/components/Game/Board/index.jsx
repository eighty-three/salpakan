import React, { useState, useEffect, useContext } from 'react';

import styles from './index.module.css';
import Piece from './Piece';

import GameInfoContext from '@/lib/GameInfoContext';

const Board = () => {
  const gameInfo = useContext(GameInfoContext);
  const [ board, setBoard ] = useState({});

  useEffect(() => {
    setBoard(gameInfo?.gameState);
  }, [gameInfo?.gameState]);

  return (
    <>
      <div className={`${styles.board}`}>
        { board &&
          <>
            {Object.keys(board).map((key) => (
              <Piece
                key={key}
                name={board[`${key}`].name}
                coordinate={key}
              />
            ))}
          </>
        }
      </div>
    </>
  );
};

export default Board;
