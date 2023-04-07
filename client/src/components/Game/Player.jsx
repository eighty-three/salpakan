import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Player.module.css';
import playerInfoStyle from './PlayerInfo.module.css';
import MatchClock from './MatchClock';
import PlayerInfo from './PlayerInfo';
import Pin from './Pin';

import GameStateContext from '@/contexts/GameStateContext';

const propTypes = {
  playerNum: PropTypes.string,
  connections: PropTypes.array
};

const Player = (props) => {
  const {
    playerNum,
    connections
  } = props;

  const [gameState] = useContext(GameStateContext);

  const name = (gameState.gameInfo?.[playerNum]?.name[1] !== '=')
    ? gameState.gameInfo?.[playerNum]?.name
    : 'Anonymous';

  const css = (gameState.player === playerNum)
    ? `${playerInfoStyle.player_text} ${playerInfoStyle.self}`
    : playerInfoStyle.player_text;

  const status =
    (connections?.includes(
      gameState.gameInfo?.[playerNum]?.name))
      ? 'online'
      : 'offline';

  const ongoing = (gameState.turn !== undefined) ? true : false;

  return (
    <div className={styles.container}>
      {(gameState.turn !== undefined || gameState.gameInfo?.winner) &&
        <>
          <div className={styles.info}>
            <PlayerInfo
              name={name}
              css={css}
              status={status}
              ongoing={ongoing}
            />
          </div>
          <div className={styles.pin}>
            { !gameState.gameInfo?.winner &&
              <Pin
                player={playerNum}
                pin={gameState.gameInfo?.[playerNum]?.pin}
              />
            }
          </div>
          <div className={styles.result}>
            { !gameState.gameInfo?.winner &&
              <MatchClock playerNum={playerNum} />
            }
            { gameState.gameInfo?.winner === gameState.gameInfo?.[playerNum].name &&
              <div className={styles.winner}>WINNER</div>
            }
          </div>
        </>
      }
    </div>
  );
};

Player.propTypes = propTypes;

export default Player;
