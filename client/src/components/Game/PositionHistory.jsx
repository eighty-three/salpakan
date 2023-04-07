import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  moves: PropTypes.arrayOf(PropTypes.string)
};


// To fix
const PositionHistory = ({
  moves
}) => {
  return (
    <>
      {moves.map((move, idx) => (
        <span key={idx}>[{move}]</span>
      ))}
    </>
  );
};

PositionHistory.propTypes = propTypes;
export default PositionHistory;
