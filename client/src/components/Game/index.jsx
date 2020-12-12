import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import SetupPanel from './SetupPanel';
import Board from './Board';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import UserContext from '@/lib/UserContext';
import { connectToGame } from '@/lib/game';

const propTypes = {
  id: PropTypes.string,
  state: PropTypes.object
};

const Game = (props) =>{
  const {
    id,
    state
  } = props;

  const [ socket, setSocket] = useState(null);
  const [ gameInfo, setGameInfo ] = useState(null);
  const [ user, setUser ] = useState('');

  useEffect(() => {
    if (state.ongoing) {
      setSocket(connectToGame(id, setGameInfo, setUser));
    } else {
      setGameInfo(state);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={user}>
        <GameInfoContext.Provider value={gameInfo}>
          <SocketContext.Provider value={socket}>
            {(gameInfo?.turn !== undefined)
              ? (<Panel />)
              : (<SetupPanel />)
            }
            <Board />
          </SocketContext.Provider>
        </GameInfoContext.Provider>
      </UserContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
