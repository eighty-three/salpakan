import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import { find } from '@/lib/matchmaking';

const propTypes = {
  username: PropTypes.string
};

const FindGameButton = (props) => {
  const {
    username,
  } = props;

  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Find Match' });

  useEffect(() => {
    setButtonState({ ...buttonState, text: 'Find Match' });
  }, []);

  const onClickFn = async (username) => {
    if (!username) { 
      setButtonState({ ...buttonState, text: 'You need to be logged in!' });
    } else {
      const req = await find(username);
      setButtonState({ disabled: true, text: 'Finding...' });
      
      if (req && !req.error) {
        setButtonState({ disabled: false, text: 'Found match!' });
      } else if (req && req.error) {
        setButtonState({ disabled: false, text: req.error });
      }
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
