import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './Piece.module.scss';

import ON_MOVE from '@/sounds/on_move.mp3';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import PlayerContext from '@/lib/PlayerContext';
import SettersContext from '@/lib/SettersContext';

import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';
import { getCurrentCoordinates, getSquareDimensions, snapToCursor } from '@/lib/drag';

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

  const [setGameInfo, setTurn] = useContext(SettersContext);
  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const turn = useContext(TurnContext);
  const player = useContext(PlayerContext);

  const [ style, setStyle ] = useState({ visibility: 'visible' });

  /* isDragging is a state to prevent other events from activating
   * on other pieces while the actual relevant piece is being moved
   */
  const [ isDragging, setIsDragging ] = useState(false);

  /* 'drop' events will hide the piece to prevent the flickering
   * so this useEffect call with reveal it again
   */
  const [ hasDropped, setDrop ] = useState(false);
  useEffect(() => {
    setStyle({ visibility: 'visible' });
    setDrop(false);
  }, [hasDropped]);

  const dragStart = (e) => {
    e.preventDefault();

    setIsDragging(true);
    snapToCursor(e, setStyle);

    /* get coordinate from localStorage because using
     * dataTransfer.(g|s)etData isn't working
     */
    localStorage.setItem('coordinate', coordinate);
    updateDragState({ type: 'dragStart' });
  };

  const drag = (e) => {
    e.preventDefault();
    if (isDragging) snapToCursor(e, setStyle);
  };

  const drop = (e) => {
    if (isDragging) {
      e.preventDefault();
      updateDragState({ type: 'dragEnd' });

      const [ sW, sH ] = getSquareDimensions(e);
      const [ x, y ] = getCurrentCoordinates(e);
      const col = Math.ceil(x/sW);
      const row = Math.ceil(y/sH);

      const origin = localStorage.getItem('coordinate');
      const destination = `${String.fromCharCode(col+64)}${row}`;

      if (turn === undefined) {

        /* If the piece didn't change places or if the piece is not placed
         * on the grid, set it back to its original position
         */
        if (origin === destination || !checkIfWithinBounds(player, destination)) {
          setStyle({ visibility: 'visible' });

        } else if (checkIfWithinBounds(player, destination)) {
          setGameInfo((prev) => {
            const fixedBoard = {...prev.board};
            const originValue = prev.board[origin];
            const destValue = prev.board[destination];
            const board = {
              ...fixedBoard,
              [origin]: destValue,
              [destination]: originValue
            };

            if (!destValue) delete board[origin];

            return {...prev, board};
          });

          /* Hide piece after setGameInfo so it won't go back to its
           * original position in that instant. useEffect's purpose is to
           * set back visibility to 'visible' once the piece(s) are in the
           * new, correct position
           */
          setStyle({ visibility: 'hidden' });

          const sound = new Audio(ON_MOVE);
          sound.play();
        }
      } else if (player === turn) { // Only allow moves on player's turn
        if (checkIfLegal(gameInfo.board, origin, destination)) {

          /* Set turn to null so that the timer for the player stops
           * counting down from his perspective while waiting for the
           * server to confirm the move
           */
          setTurn(null);

          socket.send(JSON.stringify({
            type: 'move',
            message: {
              o: origin,
              d: destination
            }
          }));
        }
      }

      setIsDragging(false);
    }

    setDrop(true);
  };

  const pieceStyle = styles[name];
  const coordinateStyle = styles[coordinate];
  const ownerStyle = (owner === 'opponent') ? styles.opponent : '';
  const css = `${pieceStyle} ${coordinateStyle} ${ownerStyle} ${styles.piece}`;

  const options = (name !== 'unknown' && !winner)
    ? {
      className: css,

      // Mouse events
      onMouseDown: dragStart,
      onMouseMove: drag,
      onMouseUp: drop,

      // Touch events
      onTouchStart: dragStart,
      onTouchMove: drag,
      onTouchEnd: drop,
      style
    } : {
      className: css
    };

  const div = React.createElement('div', options);

  return div;
};

Piece.propTypes = propTypes;
export default React.memo(Piece);
