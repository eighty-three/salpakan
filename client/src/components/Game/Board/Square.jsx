import React from 'react';
import PropTypes from 'prop-types';

import pos from './Piece.module.scss';
import styles from './Square.module.scss';

const propTypes = {
  coordinate: PropTypes.string,
  direction: PropTypes.string
};

const Square = (props) => {
  const {
    coordinate,
    direction
  } = props;

  const style = (coordinate !== 'unknown')
    ? `${pos[coordinate]} ${styles[direction]} ${styles.square}`
    : `${styles[direction]} ${styles.square} ${styles.hidden}`;

  return <div className={style}></div>;
};

Square.propTypes = propTypes;

export default React.memo(Square);
