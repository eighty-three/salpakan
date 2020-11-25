import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';

import { findMatch } from '@/lib/matchmaking';

const FindGameButton = () => {
  const [ buttonState, setButtonState ] = useState({ disabled: false, text: 'Find Match' });

  return (
    <>
      <Button
        onClick={() => findMatch(setButtonState)}
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

export default FindGameButton;
