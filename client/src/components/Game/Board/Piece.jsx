import React from 'react';
import PropTypes from 'prop-types';

import styles from './Piece.module.css';

const propTypes = {
  name: PropTypes.string,
  coordinate: PropTypes.string
};

const Piece = (props) => {
  const {
    name,
    coordinate
  } = props;
  // useState to save coordinate?

  const pieceStyle = styles[name]; // should have 'unknown' style to represent unknown pieces
  const coordinateStyle = styles[coordinate];
  const css = `${pieceStyle} ${coordinateStyle} ${styles.piece}`;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={css}>
          {name}{coordinate}
        </div>
      </div>
    </>
  );
};

Piece.propTypes = propTypes;

export default Piece;
