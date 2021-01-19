import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import { createLobby } from '@/lib/lobby';

const propTypes = {
  cookieValue: PropTypes.string
};

const CreateLobbyButton = (props) => {
  const {
    cookieValue
  } = props;

  const [ buttonState, setButtonState ] = useState({
    disabled: false,
    text: 'Create Private Lobby'
  });

  const onClickFn = (auth) => {
    if (auth) {
      setButtonState({ disabled: true, text: 'Creating...' });
      createLobby(setButtonState);
    } else {
      setButtonState({ disabled: false, text: 'Please try again' });
    }
  };

  return (
    <>
      <Button
        onClick={() => onClickFn(cookieValue)}
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

CreateLobbyButton.propTypes = propTypes;

export default CreateLobbyButton;
