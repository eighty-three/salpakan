import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  statusCode: PropTypes.number,
  error: PropTypes.string
};

const Custom404 = ({statusCode, error}) => {
  return (
    statusCode
      ? <h1 className={'text-center'}>{statusCode} - {error}</h1>
      : <h1 className={'text-center'}>404 - Not Found</h1>
  );
};

Custom404.propTypes = propTypes;

export default Custom404;
