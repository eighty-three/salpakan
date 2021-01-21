import React, { useState, useEffect, useContext, useReducer } from 'react';

import styles from './DragTarget.module.scss';

import Piece from './Piece';
import DragTarget from './DragTarget';

import GameInfoContext from '@/lib/GameInfoContext';
import DragContext from '@/lib/DragContext';
import DragReducer from '@/lib/DragReducer';

const Pieces = () => {
  const gameInfo = useContext(GameInfoContext);
  const [ board, setBoard ] = useState({});

  /* `winner` key is purely for UX, so pieces can't be moved
   * or `DragTarget` can't be dropped on anymore on game end
   */
  const initialState = {
    draggable: false,
    css: styles.target,
    winner: (gameInfo?.winner) ? true : false
  };

  const [ state, dispatch ] = useReducer(DragReducer, initialState);

  useEffect(() => {
    setBoard(gameInfo?.board);
  }, [gameInfo?.board]);

  useEffect(() => {
    dispatch({ type: 'update', payload: (gameInfo?.winner) ? true : false });
  }, [gameInfo?.winner]);

  return (
    <>
      <DragContext.Provider value={[state, dispatch]}>
        <DragTarget />
        { board &&
          <>
            {Object.keys(board).map((key) => {
              return (
                <Piece
                  key={key}
                  name={board[key].name}
                  coordinate={key}
                />
              );
            })}
          </>
        }
      </DragContext.Provider>
    </>
  );
};

export default Pieces;
