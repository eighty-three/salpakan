import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Player from './Player';
import Setup from './Setup';
import Board from './Board';

import SocketContext from '@/lib/SocketContext';
import GameInfoContext from '@/lib/GameInfoContext';
import UserContext from '@/lib/UserContext';
import TurnContext from '@/lib/TurnContext';
import { connectToGame, checkIfLegal } from '@/lib/game';

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
  const [ user, setUser ] = useState(null);
  const [ turn, setTurn ] = useState(undefined);

  useEffect(() => {
    if (state.ongoing) {
      setSocket(connectToGame(id, setGameInfo, setUser, setTurn));
    } else {
      setGameInfo(state);
    }
  }, []);

  const moveFn = () => {
    // Temporary to simulate moves. It should be attached to the Piece components
    if (
      user === turn
      && !gameInfo?.winner
    ) {
      if (checkIfLegal(gameInfo.board, 'C3', 'C4')) {
        setTurn(null);

        socket.send(JSON.stringify({
          type: 'move',
          message: {
            o: 'C3',
            d: 'C4'
          }
        }));
      }
    }
  };

  return (
    <>
      <UserContext.Provider value={user}>
        <GameInfoContext.Provider value={gameInfo}>
          <SocketContext.Provider value={socket}>
            <TurnContext.Provider value={turn}>
              <div className={styles.container}>

                <button onClick={moveFn}>Emulate Move</button>

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
            </TurnContext.Provider>
          </SocketContext.Provider>
        </GameInfoContext.Provider>
      </UserContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
