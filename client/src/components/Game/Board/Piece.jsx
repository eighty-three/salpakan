import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from './Piece.module.scss';

const propTypes = {
  name: PropTypes.string,
  coordinate: PropTypes.string,
  updateDragState: PropTypes.func,
  winner: PropTypes.bool,
  owner: PropTypes.string
};

const Piece = (props) => {
  const {
    name, // for image of piece
    coordinate, // for position of piece
    updateDragState,
    winner,
    owner
  } = props;

  const [ vis, setVis ] = useState(null);
  const [ isDragging, setIsDragging ] = useState(false);

  const dragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);

    /* get coordinate from localStorage because using
     * dataTransfer.(g|s)etData isn't working
     */
    localStorage.setItem('coordinate', coordinate);

    setVis('hidden');
    updateDragState({ type: 'dragStart' });
  };

  const dragEnd = (e) => {
    if (isDragging) {
      e.preventDefault();

      setIsDragging(false);
      setVis('visible');
      updateDragState({ type: 'dragEnd' });
    }
  };

  const pieceStyle = styles[name];
  const coordinateStyle = styles[coordinate];
  const ownerStyle = (owner === 'opponent') ? styles.opponent : '';
  const css = `${pieceStyle} ${coordinateStyle} ${ownerStyle} ${styles.piece}`;

  const options = (name !== 'unknown' && !winner)
    ? {
      className: `${css} ${styles.movable}`,
      onDragEnter: dragStart,
      onDragEnd: dragEnd,
      draggable: true,
      style: { visibility: vis }
    } : {
      className: css,
    };

  const div = React.createElement('div', options);

  return div;
};

Piece.propTypes = propTypes;
export default React.memo(Piece);
