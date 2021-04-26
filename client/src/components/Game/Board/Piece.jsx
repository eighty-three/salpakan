import React, { useEffect, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import styles from './Piece.module.scss';

import PieceStateReducer from '@/reducers/PieceStateReducer';
import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';
import { getCurrentCoordinates, getSquareDimensions } from '@/lib/drag';
import GameStateContext from '@/contexts/GameStateContext';
import SoundContext from '@/contexts/SoundContext';

const propTypes = {
  name: PropTypes.string,
  coordinate: PropTypes.string,
  updateDragState: PropTypes.func,
  winner: PropTypes.bool,
  owner: PropTypes.string
};

const Piece = (props) => {
  const {
    name, // for image of piece
    coordinate, // for position of piece
    updateDragState,
    winner,
    owner
  } = props;

  const [gameState, dispatch] = useContext(GameStateContext);
  const { move } = useContext(SoundContext);

  const initialPieceState = {
    style: { visibility: 'visible' },

    /* isDragging is a state to prevent other events from activating
     * on other pieces while the actual relevant piece is being moved
     */
    isDragging: false,

    /* 'drop' events will hide the piece to prevent the flickering
     * so this useEffect call with reveal it again. Not used on moves,
     * only during setup because of possible delay which will result in
     * the piece being invisible until the response from the server
     */
    hasDropped: false
  };

  const [pieceState, changePieceState] = useReducer(PieceStateReducer, initialPieceState);

  useEffect(() => {
    changePieceState({ type: 'revertState' });
  }, [pieceState.hasDropped]);

  const dragStart = (e) => {
    if (e.cancelable) e.preventDefault(); // for touchevents
    changePieceState({ type: 'dragStart', payload: e });

    /* get coordinate from localStorage because using
     * dataTransfer.(g|s)etData isn't working
     */
    localStorage.setItem('coordinate', coordinate);
    updateDragState({ type: 'dragStart', payload: changePieceState });
  };


  /* * * * * * * *
   * Touch Events
   * * * * * * * */

  const touchStart = (e) => {
    if (e.cancelable) e.preventDefault();
    changePieceState({ type: 'dragStart', payload: e });

    /* get coordinate from localStorage because using
     * dataTransfer.(g|s)etData isn't working
     */
    localStorage.setItem('coordinate', coordinate);
  };

  const touchMove = (e) => {
    if (e.cancelable) e.preventDefault();

    /* If Piece has no parentNode, don't continue with dispatch.
     * This is only a problem (not really, it's a noop) that happens when the user
     * is dragging the Piece component when time runs out.
     *
     * Is there a better way of doing this, like cancelling the event altogether?
     */
    if (pieceState.isDragging && e?.target?.parentNode) {
      changePieceState({ type: 'dragging', payload: e });
    }
  };

  const touchEnd = (e) => {
    e.preventDefault();
    if (pieceState.isDragging) {
      const [sW, sH] = getSquareDimensions(e);
      const [x, y] = getCurrentCoordinates(e);
      const col = Math.ceil(x/sW);
      const row = Math.ceil(y/sH);

      const origin = localStorage.getItem('coordinate');
      const destination = `${String.fromCharCode(col+64)}${row}`;
      const coordinates = { origin, destination };

      if (gameState.turn === undefined && !gameState.gameInfo.setup) {

        /* If the piece didn't change places or if the piece is not placed
         * on the grid, set it back to its original position
         */
        if (origin === destination || !checkIfWithinBounds(gameState.player, destination)) {
          changePieceState({ type: 'revertPosition' });
        } else if (checkIfWithinBounds(gameState.player, destination)) {
          dispatch({ type: 'onPieceSetup', payload: coordinates, sound: { move }});

          /* Hide piece after setGameInfo so it won't go back to its
           * original position in that instant. useEffect's purpose is to
           * set back visibility to 'visible' once the piece(s) are in the
           * new, correct position
           */
          changePieceState({ type: 'hidePiece' });
        }
      } else if (gameState.player === gameState.turn) { // Only allow moves on player's turn
        if (checkIfLegal(gameState.board, coordinates)) {

          /* Set turn to null so that the timer for the player stops
           * counting down from his perspective while waiting for the
           * server to confirm the move
           */
          dispatch({ type: 'onPieceMove' });

          gameState.socket.send(JSON.stringify({
            type: 'move',
            message: coordinates
          }));
        }
      }

      changePieceState({ type: 'dropped' });
    }
  };

  const pieceStyle = styles[name];
  const coordinateStyle = styles[coordinate];
  const ownerStyle = styles[owner];
  const lastMove = gameState.gameInfo?.lastMove?.destination;
  const lastMoveStyle = (lastMove === coordinate) ? styles.lastMove : '';
  const css = `${pieceStyle} ${coordinateStyle} ${ownerStyle} ${styles.piece} ${lastMoveStyle}`;

  const options = (name !== 'unknown' && !winner)
    ? {
      className: css,

      // Mouse events
      onMouseDown: dragStart,

      // Touch events
      onTouchStart: touchStart,
      onTouchMove: touchMove,
      onTouchEnd: touchEnd,
      style: pieceState.style
    } : {
      className: css
    };

  const div = React.createElement('div', options);

  return div;
};

Piece.propTypes = propTypes;
export default React.memo(Piece);
