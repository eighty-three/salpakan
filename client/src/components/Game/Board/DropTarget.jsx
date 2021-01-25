import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';
import GameStateContext from '@/lib/GameStateContext';

const propTypes = {
  updateDragState: PropTypes.func,
  dragState: PropTypes.object
};

const DropTarget = (props) => {
  const {
    updateDragState,
    dragState
  } = props;

  const [state, dispatch] = useContext(GameStateContext);

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const check = (e) => {
    e.preventDefault();

    updateDragState({ type: 'dragEnd' });

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.ceil(x / (rect.width / 9));
    const row = Math.ceil(y / (rect.height / 8));
    const destination = `${String.fromCharCode(col+64)}${row}`;
    const origin = localStorage.getItem('coordinate');

    if (state.turn === undefined) {
      if (checkIfWithinBounds(state.player, destination)) {
        dispatch({ type: 'onPieceSetup', payload: { origin, destination }});
      }
    } else if (state.player === state.turn) {
      if (checkIfLegal(state.board, origin, destination)) {
        dispatch({ type: 'onPieceMove' });

        state.socket.send(JSON.stringify({
          type: 'move',
          message: {
            o: origin,
            d: destination
          }
        }));

      }
    }
  };

  const options = (!dragState.draggable && !dragState.winner)
    ? {
      className: dragState.css,
      onDragEnter: dragEnter,
      onDragOver: dragOver,
      onDrop: check
    } : {
      className: dragState.css,
    };

  return React.createElement('div', options);
};

DropTarget.propTypes = propTypes;

export default DropTarget;
