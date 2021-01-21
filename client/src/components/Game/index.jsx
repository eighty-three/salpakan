import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Player from './Player';
import Setup from './Setup';
import Board from './Board';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import PlayerContext from '@/lib/PlayerContext';
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
  const [ turn, setTurn ] = useState(undefined);
  const [ player, setPlayer ] = useState(null);

  useEffect(() => {
    if (state.ongoing) {
      setSocket(connectToGame(id, setGameInfo, setTurn, setPlayer));
    } else {
      setGameInfo(state);
    }
  }, []);

  return (
    <>
      <SocketContext.Provider value={socket}>
        <GameInfoContext.Provider value={gameInfo}>
          <TurnContext.Provider value={turn}>
            <PlayerContext.Provider value={player}>
              <div className={styles.container}>
                <div className={styles.p1}>
                  {(turn === undefined && !gameInfo?.winner)
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
            </PlayerContext.Provider>
          </TurnContext.Provider>
        </GameInfoContext.Provider>
      </SocketContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
