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
import SettersContext from '@/lib/SettersContext';

import { WSGAME_URL, gameSocketOnMessage }  from '@/lib/game';
import ws from 'ws';
const WS = global.WebSocket || ws;

const propTypes = {
  id: PropTypes.string,
  state: PropTypes.object
};

const Game = (props) =>{
  const {
    id,
    state
  } = props;

  const [ socket, setSocket ] = useState(null);
  const [ gameInfo, setGameInfo ] = useState(null);
  const [ turn, setTurn ] = useState(undefined);
  const [ player, setPlayer ] = useState(null);

  useEffect(() => {
    let socketCn;
    if (state.ongoing) {
      socketCn = new WS(`${WSGAME_URL}/${id}`);
      socketCn.onclose = () => setGameInfo(null);
      socketCn.onmessage = (message) => {
        const res = JSON.parse(message.data);
        gameSocketOnMessage(res, {
          gameInfo: setGameInfo,
          turn: setTurn,
          player: setPlayer
        });
      };

      setSocket(socketCn);

    } else {
      setGameInfo({
        board: state.gameState.player1_state,
        p1: { name: state.p1.name },
        p2: { name: state.p2.name },
        winner: state.winner
      });
    }

    return () => {
      if (state.ongoing) {
        socketCn.close();
      }
    };
  }, []);

  return (
    <>
      <SettersContext.Provider value={[setGameInfo, setTurn]}>
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
      </SettersContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
