import React, { useContext } from 'react';

import styles from './Players.module.css';

import GameInfoContext from '@/lib/GameInfoContext';
import UserContext from '@/lib/UserContext';

const Players = () => {
  const gameInfo = useContext(GameInfoContext);
  const user = useContext(UserContext);
  const players = {
    p1: {
      name: gameInfo?.p1.name,
      css: (gameInfo?.p1.name === user)
        ? `${styles.player_text} ${styles.self}`
        : styles.player_text
    },
    p2: {
      name: gameInfo?.p2.name,
      css: (gameInfo?.p2.name === user)
        ? `${styles.player_text} ${styles.self}`
        : styles.player_text
    }
  };

  return (
    <>
      { gameInfo &&
        <div className={styles.container}>
          <p className={players.p1.css}>{players.p1.name}</p>
          <p className={players.p2.css}>{players.p2.name}</p>
        </div>
      }
    </>
  );
};

export default Players;
