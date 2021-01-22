import React, { useContext } from 'react';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import PlayerContext from '@/lib/PlayerContext';
import DragContext from '@/lib/DragContext';
import SettersContext from '@/lib/SettersContext';

import { checkIfWithinBounds, checkIfLegal } from '@/lib/game';

const DragTarget = () => {
  const [setGameInfo, setTurn] = useContext(SettersContext);

  const socket = useContext(SocketContext);
  const gameInfo = useContext(GameInfoContext);
  const turn = useContext(TurnContext);
  const player = useContext(PlayerContext);

  const [state, dispatch] = useContext(DragContext);

  const dragStart = (e) => {
    e.preventDefault();
  };

  const dragEnd = (e) => {
    e.preventDefault();
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const check = (e) => {
    e.preventDefault();

    dispatch({ type: 'dragEnd' });

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

  const options = (!state.draggable && !state.winner)
    ? {
      className: state.css,
      onDrag: dragStart,
      onDragOver: dragOver,
      onDragEnd: dragEnd,
      onDrop: check
    } : {
      className: state.css,
    };

  return React.createElement('div', options);
};

export default DragTarget;
