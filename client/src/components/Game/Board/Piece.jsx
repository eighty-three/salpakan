import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './Piece.module.scss';

import DragContext from '@/lib/DragContext';

const propTypes = {
  name: PropTypes.string,
  coordinate: PropTypes.string
};

const Piece = (props) => {
  const {
    name, // for image of piece
    coordinate // for position of piece
  } = props;

  /* `setVis` is separate from `dispatch` from context
   * because it should be local to the piece, else
   * every other piece will also be hidden on movable
   */
  const [ vis, setVis ] = useState(null);
  const [state, dispatch] = useContext(DragContext);

  const dragStart = (e) => {
    e.preventDefault();

    /* get coordinate from localStorage because using
     * dataTransfer.(g|s)etData isn't working
     */
    localStorage.setItem('coordinate', coordinate);

    setVis('hidden');
    dispatch({ type: 'dragStart' });
  };

  const dragEnd = (e) => {
    e.preventDefault();

    setVis('visible');
    dispatch({ type: 'dragEnd' });
  };

  const pieceStyle = styles[name];
  const coordinateStyle = styles[coordinate];
  const css = `${pieceStyle} ${coordinateStyle} ${styles.piece}`;

  const options = (name !== 'unknown' && !state.winner)
    ? {
      className: `${css} ${styles.movable}`,
      onDragEnter: dragStart,
      onDragEnd: dragEnd,
      draggable: state.draggable,
      style: { visibility: vis }
    } : {
      className: css,
    };

  const div = React.createElement('div', options);

  return div;
};

Piece.propTypes = propTypes;
export default Piece;
