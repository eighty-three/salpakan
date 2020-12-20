import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Player.module.css';
import MatchClock from './MatchClock';
import PlayerInfo from './PlayerInfo';
import Winner from './Winner';

import GameInfoContext from '@/lib/GameInfoContext';

const propTypes = {
  playerNum: PropTypes.string
};

const Player = (props) => {
  const {
    playerNum
  } = props;

  const gameInfo = useContext(GameInfoContext);

  return (
    <div className={styles.container}>
      {(gameInfo?.turn !== undefined || gameInfo?.winner) &&
        <>
          <div className={styles.info}>
            <PlayerInfo playerNum={playerNum} />
          </div>
          <div className={styles.result}>
            { gameInfo?.winner
              ? (<Winner playerNum={playerNum} />)
              : (<MatchClock playerNum={playerNum} />)
            }
          </div>
        </>
      }
    </div>
  );
};

Player.propTypes = propTypes;

export default Player;
