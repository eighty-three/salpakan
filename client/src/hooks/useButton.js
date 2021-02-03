import { useState, useEffect } from 'react';

/**
 * Custom hook that disables the button until
 * proper page load/component mount
 *
 * @param {string} buttonText The text for the button
 * @returns {array} The state and the updater of the state, literally the same as the returned array in useState
 */
const useButton = (buttonText) => {
  // sets the initial state of the button as disabled
  const [buttonState, setButtonState] = useState({
    text: buttonText,
    disabled: true
  });

  // enables it on mount
  useEffect(() => {
    setButtonState({ ...buttonState, disabled: false });
  }, []);

  return [buttonState, setButtonState];
};

export default useButton;
