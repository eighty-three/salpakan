import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './PlayerInfo.module.css';

import GameInfoContext from '@/lib/GameInfoContext';
import PlayerContext from '@/lib/PlayerContext';

const propTypes = {
  playerNum: PropTypes.string
};

const PlayerInfo = (props) => {
  const {
    playerNum
  } = props;

  const gameInfo = useContext(GameInfoContext);
  const player = useContext(PlayerContext);

  const name = (gameInfo?.[playerNum].name[1] !== '=')
    ? gameInfo?.[playerNum].name
    : 'Anonymous';

  const css = (player === playerNum)
    ? `${styles.player_text} ${styles.self}`
    : styles.player_text;

  return (
    <div className={styles.container}>
      <div className={css}>{name}</div>
    </div>
  );
};

PlayerInfo.propTypes = propTypes;

export default PlayerInfo;
