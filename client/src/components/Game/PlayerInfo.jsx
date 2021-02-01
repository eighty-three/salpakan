import React from 'react';
import PropTypes from 'prop-types';

import styles from './PlayerInfo.module.css';

const propTypes = {
  name: PropTypes.string,
  css: PropTypes.string,
  status: PropTypes.string
};

const PlayerInfo = (props) => {
  const {
    name,
    css,
    status
  } = props;

  const statusStyle = (status === 'online') ? styles.online : styles.offline;

  return (
    <div className={styles.container}>
      <div className={`${styles.indicator} ${statusStyle}`}></div>
      <div className={css}>{name}</div>
    </div>
  );
};

PlayerInfo.propTypes = propTypes;

export default React.memo(PlayerInfo);
