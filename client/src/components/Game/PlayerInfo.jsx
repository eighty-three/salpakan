import React from 'react';
import PropTypes from 'prop-types';

import styles from './PlayerInfo.module.css';

const propTypes = {
  name: PropTypes.string,
  css: PropTypes.string
};

const PlayerInfo = (props) => {
  const {
    name,
    css
  } = props;

  return (
    <div className={styles.container}>
      <div className={css}>{name}</div>
    </div>
  );
};

PlayerInfo.propTypes = propTypes;

export default React.memo(PlayerInfo);
