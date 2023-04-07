import React from 'react';

import styles from './Grid.module.scss';

const Grid = () => {
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <>
      {columns.map((col) => (
        <React.Fragment key={col}>
          {rows.map((row) => {
            return (
              <div
                key={row}
                className={styles.coord}
              >
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default React.memo(Grid);
