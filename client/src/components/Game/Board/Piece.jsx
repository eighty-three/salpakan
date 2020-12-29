import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  name: PropTypes.string
};

const Piece = (props) => {
  const {
    name
  } = props;

  return (
    <div>
      {name}
    </div>
  );
};

Piece.propTypes = propTypes;

export default Piece;
