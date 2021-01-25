import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ON_MOVE from '@/sounds/on_move.mp3';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import PlayerContext from '@/lib/PlayerContext';
import SettersContext from '@/lib/SettersContext';

import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';

const propTypes = {
  updateDragState: PropTypes.func,
  dragState: PropTypes.object
};

const DropTarget = (props) => {
  const {
    updateDragState,
    dragState
  } = props;

  const [setGameInfo, setTurn] = useContext(SettersContext);

  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const turn = useContext(TurnContext);
  const player = useContext(PlayerContext);

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

    if (turn === undefined) {
      if (checkIfWithinBounds(player, destination)) {
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

        const sound = new Audio(ON_MOVE);
        sound.play();
      }
    } else if (
      player === turn
      && !gameInfo?.winner
    ) {
      if (checkIfLegal(gameInfo.board, origin, destination)) {
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
