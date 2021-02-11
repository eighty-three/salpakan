import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';
import { getCursorCoordinates, getCurrentCoordinates, getSquareDimensions } from '@/lib/drag';
import GameStateContext from '@/contexts/GameStateContext';
import SoundContext from '@/contexts/SoundContext';

const propTypes = {
  updateDragState: PropTypes.func,
  dragState: PropTypes.object
};

const DropTarget = (props) => {
  const {
    updateDragState,
    dragState
  } = props;

  const [gameState, dispatch] = useContext(GameStateContext);
  const { move } = useContext(SoundContext);

  const onDrop = (e) => {
    e.preventDefault();

    const [sW, sH] = getSquareDimensions(e);
    const [x, y] = getCurrentCoordinates(e);
    const col = Math.ceil(x/sW);
    const row = Math.ceil(y/sH);

    const origin = localStorage.getItem('coordinate');
    const destination = `${String.fromCharCode(col+64)}${row}`;
    const coordinates = { origin, destination };

    if (gameState.turn === undefined && !gameState.gameInfo.setup) {
      if (origin === destination || !checkIfWithinBounds(gameState.player, destination)) {
        dragState.setter({ type: 'revertPosition' });

      } else if (checkIfWithinBounds(gameState.player, destination)) {
        dispatch({ type: 'onPieceSetup', payload: coordinates, sound: { move }});
        dragState.setter({ type: 'hidePiece' });
      }

    } else if (gameState.player === gameState.turn) {
      if (checkIfLegal(gameState.board, coordinates)) {
        dispatch({ type: 'onPieceMove' });

        gameState.socket.send(JSON.stringify({
          type: 'move',
          message: coordinates
        }));
      }
    }

    updateDragState({ type: 'dragEnd' });
    dragState.setter({ type: 'dropped' });
  };


  /* onDrag is unreliable so I switched to this method. Using onMouseMove
   * works better but if the cursor moves away from the dragged Piece too
   * fast, the mouseMove event stops. It needs a bigger container to work
   * properly, hence the mouseMove event handler being placed in DropTarget.
   * However, the event needs to recognize the dragged Piece, which is why
   * the setState function of the piece is passed to the dispatch, so the
   * update of the coordinates of the Piece (in order to make it stick to
   * the cursor) is done via setState.
   */
  const mouseMove = (e) => {
    const [x, y] = getCursorCoordinates(e);

    if (dragState.setter && e.target?.parentNode) {
      dragState.setter({ type: 'snapToCursor', payload: { x, y }});
    }
  };

  const options = (!dragState.draggable && !dragState.winner)
    ? {
      className: dragState.css,
      onMouseMove: mouseMove,
      onMouseUp: onDrop
    } : {
      className: dragState.css,
    };

  return React.createElement('div', options);
};

DropTarget.propTypes = propTypes;

export default DropTarget;
