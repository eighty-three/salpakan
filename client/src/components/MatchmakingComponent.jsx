import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import { findMatch } from '@/lib/matchmaking';

const propTypes = {
  username: PropTypes.string
};

const FindGameButton = ({ username }) => {
  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Find Match' });

  const onClickFn = (username) => {
    if (username) {
      setButtonState({ disabled: true, text: 'Finding...' });
      findMatch(setButtonState);
    } else {
      setButtonState({ disabled: false, text: 'You are not logged in!'});
    }

  };

  return (
    <>
      <Button
        onClick={() => onClickFn(username)}
        variant="dark"
        type="submit"
        block
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </Button>
    </>
  );
};

FindGameButton.propTypes = propTypes;

export default FindGameButton;
