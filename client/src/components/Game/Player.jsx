import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Player.module.css';
import playerInfoStyle from './PlayerInfo.module.css';
import MatchClock from './MatchClock';
import PlayerInfo from './PlayerInfo';

import GameStateContext from '@/lib/GameStateContext';

const propTypes = {
  playerNum: PropTypes.string
};

const Player = (props) => {
  const {
    playerNum
  } = props;

  const [gameState] = useContext(GameStateContext);

  const name = (gameState.gameInfo?.[playerNum]?.name[1] !== '=')
    ? gameState.gameInfo?.[playerNum]?.name
    : 'Anonymous';

  const css = (gameState.player === playerNum)
    ? `${playerInfoStyle.player_text} ${playerInfoStyle.self}`
    : playerInfoStyle.player_text;

  return (
    <div className={styles.container}>
      {(gameState.turn !== undefined || gameState.gameInfo?.winner) &&
        <>
          <div className={styles.info}>
            <PlayerInfo
              name={name}
              css={css}
            />
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
