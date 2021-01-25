import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Player.module.css';
import playerInfoStyle from './PlayerInfo.module.css';
import MatchClock from './MatchClock';
import PlayerInfo from './PlayerInfo';

import GameInfoContext from '@/lib/GameInfoContext';
import TurnContext from '@/lib/TurnContext';
import PlayerContext from '@/lib/PlayerContext';

const propTypes = {
  playerNum: PropTypes.string
};

const Player = (props) => {
  const {
    playerNum
  } = props;

  const gameInfo = useContext(GameInfoContext);
  const turn = useContext(TurnContext);
  const player = useContext(PlayerContext);

  const name = (gameInfo?.[playerNum]?.name[1] !== '=')
    ? gameInfo?.[playerNum]?.name
    : 'Anonymous';

  const css = (player === playerNum)
    ? `${playerInfoStyle.player_text} ${playerInfoStyle.self}`
    : playerInfoStyle.player_text;

  return (
    <div className={styles.container}>
      {(turn !== undefined || gameInfo?.winner) &&
        <>
          <div className={styles.info}>
            <PlayerInfo
              name={name}
              css={css}
            />
          </div>
          <div className={styles.result}>
            { !gameInfo?.winner &&
              <MatchClock playerNum={playerNum} />
            }
            { gameInfo?.winner === gameInfo?.[playerNum].name &&
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
