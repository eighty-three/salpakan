import { useRef } from 'react';

/**
 * Custom hook that returns a delay function
 * with proper cleanup
 *
 * @param {number} seconds Duration of the delay
 * @returns {array} The delay function and the cleanup
 */
const useDelay = (seconds) => {
  const ref = useRef(null);

  const delay = () => new Promise(resolve => {
    ref.current = setTimeout(resolve, seconds * 1000);
  });

  const clearDelay = () => {
    clearTimeout(ref.current);
  };

  return [delay, clearDelay];
};

export default useDelay;
