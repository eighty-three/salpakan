import React, { useState, useContext } from 'react';

import styles from './Panel.module.css';
import Countdown from './Countdown';

import GameInfoContext from '@/lib/GameInfoContext';

const Panel = () => {
  const gameInfo = useContext(GameInfoContext);
  const [ playersInfo ] = useState(gameInfo);

  return (
    <div className={styles.container}>
      <div className={`${styles.player_info} ${styles.fade}`}>
        <p className={styles.player_text}>{playersInfo.p1.name}</p>
        <Countdown />
      </div>
      <div className={styles.player_info}>
        <p className={styles.player_text}>{playersInfo.p2.name}</p>
        <Countdown />
      </div>
    </div>
  );
};

export default Panel;
