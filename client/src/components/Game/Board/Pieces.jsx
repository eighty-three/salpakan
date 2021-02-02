import React, { useState, useEffect, useContext, useReducer } from 'react';

import styles from './DropTarget.module.scss';
import Piece from './Piece';
import DropTarget from './DropTarget';
import Square from './Square';

import DragReducer from '@/reducers/DragReducer';
import {checkDirection} from '@/lib/game';
import GameStateContext from '@/contexts/GameStateContext';

const Pieces = () => {
  const [gameState] = useContext(GameStateContext);
  const [ board, setBoard ] = useState({});

  /* `winner` key is purely for UX, so pieces can't be moved
   * or `DropTarget` can't be dropped on anymore on game end
   */
  const initialState = {
    draggable: false,
    css: styles.target,
    winner: (gameState.gameInfo?.winner) ? true : false,
    setter: null
  };

  const [ state, dispatch ] = useReducer(DragReducer, initialState);

  useEffect(() => {
    setBoard(gameState.board);
  }, [gameState.board]);

  useEffect(() => {
    dispatch({ type: 'update', payload: (gameState.gameInfo?.winner) ? true : false });
  }, [gameState.gameInfo?.winner]);

  const directions = ['up', 'down', 'left', 'right'];

  return (
    <>
      <DropTarget
        updateDragState={dispatch}
        dragState={state}
      />

      {/* Preload the arrows */}
      {directions.map((key) => (
        <Square key={key} coordinate={'unknown'} direction={key} />
      ))}

      { gameState.gameInfo?.lastMove &&
        <Square
          coordinate={gameState.gameInfo.lastMove.origin}
          direction={checkDirection(gameState.gameInfo.lastMove.origin, gameState.gameInfo.lastMove.destination)}
        />
      }

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
