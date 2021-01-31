import React, { useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import Player from './Player';
import Setup from './Setup';
import Board from './Board';
import Rematch from '../Rematch';

import ON_MOVE from '@/sounds/on_move.mp3';
import ON_VS from '@/sounds/on_vs.mp3';

import SoundContext from '@/lib/SoundContext';
import GameStateContext from '@/lib/GameStateContext';
import GameStateReducer from '@/lib/GameStateReducer';

import { WS_HOST } from '@/lib/host';
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

  const moveRef = useRef();
  const vsRef = useRef();

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

        /* attach sound file to play sound from component instead of importing
         * the sound each time
         */
        dispatch({ type: res.type, payload: res, sound: {
          move: moveRef.current,
          vs: vsRef.current
        }});
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

  useEffect(() => {
    let socketRecord;
    if (state?.ongoing) {
      socketRecord = new WS(`${WS_HOST}/ws/count`);
    }

    return () => {
      if (state?.ongoing) {
        socketRecord.close();
      }
    };
  }, []);

  return (
    <>
      {/* Audio files */}
      <audio ref={moveRef}>
        <source src={ON_MOVE} type={'audio/mpeg'} />
      </audio>

      <audio ref={vsRef}>
        <source src={ON_VS} type={'audio/mpeg'} />
      </audio>

      {/* Actual content */}
      <SoundContext.Provider value={{move: moveRef.current, vs: vsRef.current}}>
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
            <div className={styles.button}>
              {(gameState.turn !== undefined && state?.ongoing) &&
                <>
                  {(gameState.gameInfo?.winner) &&
                    (<Rematch id={id} />)
                  }
                </>
              }
            </div>
          </div>
        </GameStateContext.Provider>
      </SoundContext.Provider>
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
