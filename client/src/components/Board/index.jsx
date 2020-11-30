import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { connectToGame } from '@/lib/game';

const propTypes = {
  id: PropTypes.string,
  state: PropTypes.object
};

const Board = (props) =>{
  const {
    id,
    state
  } = props;
  const [ board, setBoard ] = useState(null);

  useEffect(() => {
    if (state.ongoing) {
      connectToGame(id, setBoard);
    } else {
      setBoard(state);
    }
  }, [props]);

  return (
    <>
      { board &&
        <h1>{JSON.stringify(board)} with CSS to display board</h1>
      }
    </>
  );
};

Board.propTypes = propTypes;

export default Board;
