import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Player from './Player';
import Setup from './Setup';
import Board from './Board';

import GameStateContext from '@/lib/GameStateContext';
import GameStateReducer from '@/lib/GameStateReducer';

import { WSGAME_URL }  from '@/lib/game';
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

  const initialState = {
    socket: null,
    gameInfo: null,
    board: null,
    turn: undefined,
    player: null
  };

  const [gameState, dispatch] = useReducer(GameStateReducer, initialState);

  useEffect(() => {
    let socketCn;
    let isMounted = true;
    if (state?.ongoing) {
      socketCn = new WS(`${WSGAME_URL}/${id}`);
      dispatch({ type: 'onSocketConnect', payload: { socket: socketCn }});

      socketCn.onclose = () => {
        /* should differentiate if socket is closing because the connection
         * was closed, or if because of the component unmounting
         */
        if (isMounted) {
          dispatch({ type: 'onSocketClose' });
        }
      };

      socketCn.onmessage = (message) => {
        const res = JSON.parse(message.data);
        dispatch({ type: res.type, payload: res });
      };


    } else {
      dispatch({ type: 'onGameEnd', payload: state });
    }

    return () => {
      if (state.ongoing) {
        isMounted = false;
        socketCn.close();
      }
    };
  }, []);

  return (
    <>
      <GameStateContext.Provider value={[gameState, dispatch]}>
        <div className={styles.container}>
          <div className={styles.setup}>
            {(gameState.turn === undefined && !gameState.gameInfo?.winner) &&
              <Setup/>
            }
          </div>
          <div className={styles.p1}>
            <Player playerNum={'p1'} />
          </div>
          <div className={styles.board}>
            <Board />
          </div>
          <div className={styles.p2}>
            <Player playerNum={'p2'} />
          </div>
        </div>
      </GameStateContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
