import React, { useState, useEffect, useContext, useReducer } from 'react';

import styles from './DropTarget.module.scss';

import Piece from './Piece';
import DropTarget from './DropTarget';

import GameInfoContext from '@/lib/GameInfoContext';
import DragContext from '@/lib/DragContext';
import DragReducer from '@/lib/DragReducer';

const Pieces = () => {
  const gameInfo = useContext(GameInfoContext);
  const [ board, setBoard ] = useState({});

  /* `winner` key is purely for UX, so pieces can't be moved
   * or `DropTarget` can't be dropped on anymore on game end
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
        <DropTarget />
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
