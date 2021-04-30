import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import utilStyles from '@/styles/utilStyles.module.scss';
import styles from './index.module.scss';
import Player from './Player';
import Setup from './Setup';
import Board from './Board';
import Rematch from '../Rematch';
import Surrender from '../Surrender';
import ON_MOVE from '@/sounds/on_move.mp3';
import ON_VS from '@/sounds/on_vs.mp3';

import useDelay from '@/hooks/useDelay';
import GameStateReducer from '@/reducers/GameStateReducer';
import GameStateContext from '@/contexts/GameStateContext';
import SoundContext from '@/contexts/SoundContext';

import { WSGAME_URL }  from '@/lib/game';
import ws from 'ws';
import PositionHistory from './PositionHistory';
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
  const [connections, setConnections] = useState({ list: [], retry: true });
  const initialText = 'Connecting to the game...';
  const [text, setText] = useState(initialText);
  const moveRef = useRef();
  const vsRef = useRef();
  const [statusPingDelay, clearStatusPingDelay] = useDelay(5);
  const [spectatorStatusPingDelay, clearSpectatorStatusPingDelay] = useDelay(15);
  const [botMoveDelay, clearBotMoveDelay] = useDelay(1.5);

  useEffect(() => {
    let gameSocket;
    let isMounted = true;
    if (state.ongoing) {
      gameSocket = new WS(`${WSGAME_URL}/${id}`);

      gameSocket.onopen = () => {
        dispatch({ type: 'onSocketConnect', payload: { socket: gameSocket }});
      };

      gameSocket.onmessage = async (message) => {
        const res = JSON.parse(message.data);
        clearBotMoveDelay();

        if (res.bot) await botMoveDelay();

        /* attach sound file to play sound from component instead of importing
         * the sound each time
         */
        dispatch({ type: res.type, payload: res, sound: {
          move: moveRef.current,
          vs: vsRef.current
        }});
      };

      gameSocket.onclose = () => {
        /* should differentiate if socket is closing because the connection
         * was closed, or if because of the component unmounting
         */
        if (isMounted) {
          dispatch({ type: 'onSocketClose' });
          clearBotMoveDelay();
        }
      };

    } else {
      dispatch({ type: 'onGameEnd', payload: state });
    }

    return () => {
      clearBotMoveDelay();
      isMounted = false;

      if (state.ongoing && gameSocket.readyState === 1) {
        gameSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    let statusIndicatorSocket;
    let isMounted = true;
    if (state.ongoing) {
      statusIndicatorSocket = new WS(`${WSGAME_URL}/status/${id}`);

      statusIndicatorSocket.onmessage = async (message) => {
        const res = JSON.parse(message.data);
        clearStatusPingDelay();
        clearSpectatorStatusPingDelay();

        if (res.connections.length !== connections.list.length) {
          setConnections({ list: res.connections, retry: !connections.retry });
        }

        if (gameState.player) {
          await statusPingDelay();
        } else {
          await spectatorStatusPingDelay();
        }

        statusIndicatorSocket.send(JSON.stringify({
          type: 'ping',
        }));
      };

      statusIndicatorSocket.onclose = (message) => {
        if (isMounted) {
          if (message.code > 4000) {
            setText(message.reason);
          }

          clearStatusPingDelay();
        }
      };
    }

    return () => {
      clearStatusPingDelay();
      isMounted = false;

      if (state.ongoing && statusIndicatorSocket.readyState === 1) {
        statusIndicatorSocket.close();
      }
    };

  /* If the connections array is used for the dependencies
   * useEffect will loop indefinitely
   */
  }, [connections.retry]);

  const surrenderFn = useCallback(
    () => {
      if (gameState.socket) {
        gameState.socket.send(JSON.stringify({
          type: 'surrender'
        }));
      }
    }, [gameState.socket]
  );

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
      { gameState?.board
        ? (
          <SoundContext.Provider value={{ move: moveRef.current, vs: vsRef.current }}>
            <GameStateContext.Provider value={[gameState, dispatch]}>
              <div className={styles.container}>
                <div className={styles.setup}>
                  {/*
                    `gameState.turn === undefined` is used as a check instead of the
                    usual falsey values (or just plain `!gameState.turn`) because
                    `gameState.turn === null` is used for when no one should have a turn
                    but the clocks should still show. Explicitly comparing it to `undefined`
                    is used to mean that the game hasn't started yet, that is, it's still
                    in the setup phase, or if the game has ended already

                    In the conditional below, it's checking for `undefined` and if there is
                    no winner yet, that is, if the game is still in the setup phase
                  */}
                  {(gameState.turn === undefined && !gameState.gameInfo?.winner) &&
                    <Setup/>
                  }
                </div>
                <div className={styles.p1}>
                  <Player
                    connections={connections.list}
                    playerNum={'p1'}
                  />
                </div>
                <div className={styles.board}>
                  <Board />
                </div>
                <div className={styles.p2}>
                  <Player
                    connections={connections.list}
                    playerNum={'p2'}
                  />
                </div>
                <div className={styles.button}>
                  {/*
                    Only show the Rematch and Surrender button
                    if the user is a player, not a spectator
                  */}
                  {(gameState.turn !== undefined
                    && state?.ongoing
                    && gameState?.player
                  ) &&
                    <>
                      {(gameState.gameInfo?.winner)
                        ? (<Rematch id={id} />)
                        : (<Surrender onClickFn={surrenderFn} />)
                      }
                    </>
                  }
                </div>
              </div>
            </GameStateContext.Provider>
          </SoundContext.Provider>
        ) : (
          <h1 className={utilStyles.textCenter}>{text}</h1>
        )
      }
      { gameState.gameInfo?.positionHistory &&
        <PositionHistory moves={gameState.gameInfo.positionHistory} />
      }
    </>
  );
};

Game.propTypes = propTypes;

export default Game;
