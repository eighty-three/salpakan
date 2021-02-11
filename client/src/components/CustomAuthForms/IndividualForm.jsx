import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  username: PropTypes.bool,
  context: PropTypes.string,
  register: PropTypes.func
};

const IndividualForm = (props) => {
  const {
    id,
    label,
    username,
    context,
    register
  } = props;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={`${id}_${context}`}>{label}</label>
      {username
        ? (
          <input
            className={styles.form}
            type="text"
            maxLength={30}
            pattern="[a-zA-Z0-9_]{1,29}"
            placeholder="[ a-z0-9_ ]{1,29}"
            spellCheck="false"
            aria-describedby={`${id}_${context}`}
            id={`${id}_${context}`}
            name={id}
            ref={register({ required: true })}
          />
        ) : (
          <input
            className={styles.form}
            type="password"
            maxLength={200}
            placeholder="maxLength=200"
            aria-describedby={`${id}_${context}`}
            id={`${id}_${context}`}
            name={id}
            ref={register({ required: true })}
          />
        )
      }
    </div>
  );
};

IndividualForm.propTypes = propTypes;

export default IndividualForm;
