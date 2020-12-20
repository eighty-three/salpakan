import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './PlayerInfo.module.css';

import GameInfoContext from '@/lib/GameInfoContext';
import UserContext from '@/lib/UserContext';

const propTypes = {
  playerNum: PropTypes.string
};

const PlayerInfo = (props) => {
  const {
    playerNum
  } = props;

  const gameInfo = useContext(GameInfoContext);
  const user = useContext(UserContext);

  const name = gameInfo?.[playerNum].name;
  const css = (gameInfo?.[playerNum].name === user)
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
