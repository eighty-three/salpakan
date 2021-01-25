import React, { useState, useEffect, useContext, useReducer } from 'react';

import styles from './DropTarget.module.scss';

import Piece from './Piece';
import DropTarget from './DropTarget';

import DragReducer from '@/lib/DragReducer';
import GameStateContext from '@/lib/GameStateContext';

const Pieces = () => {
  const [gameState] = useContext(GameStateContext);
  const [ board, setBoard ] = useState({});

  /* `winner` key is purely for UX, so pieces can't be moved
   * or `DropTarget` can't be dropped on anymore on game end
   */
  const initialState = {
    draggable: false,
    css: styles.target,
    winner: (gameState.gameInfo?.winner) ? true : false
  };

  const [ state, dispatch ] = useReducer(DragReducer, initialState);

  useEffect(() => {
    setBoard(gameState.board);
  }, [gameState.board]);

  useEffect(() => {
    dispatch({ type: 'update', payload: (gameState.gameInfo?.winner) ? true : false });
  }, [gameState.gameInfo?.winner]);

  return (
    <>
      <DropTarget
        updateDragState={dispatch}
        dragState={state}
      />

      { board &&
        <>
          {Object.keys(board).map((key) => {
            const owner = (board[key]?.owner) ? board[key].owner : '';

            return (
              <Piece
                key={key}
                name={board[key].name}
                coordinate={key}
                winner={state.winner}
                updateDragState={dispatch}
                owner={owner}
              />
            );
          })}
        </>
      }
    </>
  );
};

export default Pieces;
