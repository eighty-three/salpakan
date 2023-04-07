import React from 'react';

import styles from './index.module.scss';

import Grid from './Grid';
import Pieces from './Pieces';

const Board = () => {
  return (
    <div className={styles.positionWrapper}>
      <div className={styles.fillWrapper}>
        <div className={styles.board}>
          <Pieces />
          <Grid />
        </div>

        <div className={styles.placeholder}></div>
      </div>
    </div>
  );
};

export default React.memo(Board);
