import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Player from './Player';
import Setup from './Setup';
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
            <div className={styles.container}>
              <div className={styles.p1}>
                {(gameInfo?.turn === undefined || !gameInfo?.winner)
                  ? (<Setup/>)
                  : (<Player playerNum={'p1'} />)
                }
              </div>

              <div className={styles.board}>
                <Board />
              </div>

              <div className={styles.p2}>
                <Player playerNum={'p2'} />
              </div>
            </div>
          </SocketContext.Provider>
        </GameInfoContext.Provider>
      </UserContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
