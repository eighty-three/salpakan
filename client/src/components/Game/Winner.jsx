import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Winner.module.css';

import GameInfoContext from '@/lib/GameInfoContext';

const propTypes = {
  playerNum: PropTypes.string
};

const Winner = (props) => {
  const {
    playerNum
  } = props;

  const gameInfo = useContext(GameInfoContext);

  const text = (gameInfo?.[playerNum].name === gameInfo?.winner)
    ? 'WINNER'
    : '';

  return (
    <div className={styles.text}>{text}</div>
  );
};

Winner.propTypes = propTypes;

export default Winner;
