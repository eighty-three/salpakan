/**
 * Gets the current coordinates of the MouseEvent/TouchEvent
 *
 * The offset is used to contain the coordinates to the board
 * itself, as opposed to the whole screen.
 *
 * @returns {array} x and y coordinates
 */
export const getCurrentCoordinates = (e) => {
  let eventX, eventY;

  if (e.changedTouches) { // If TouchEvent
    eventX = e.changedTouches[0].clientX;
    eventY = e.changedTouches[0].clientY;
  } else if (e.clientX && e.clientY) { // If MouseEvent
    eventX = e.clientX;
    eventY = e.clientY;
  }

  const offset = e.target.parentNode.getBoundingClientRect();
  const x = eventX - offset.left;
  const y = eventY - offset.top;

  return [x, y];
};

/**
 * Gets the dimensions of the square (each block of the main grid)
 *
 * It divides the height and width of the parentNode, the Board,
 * by 8 and 9 respectively (because the game board is an 8x9 grid)
 *
 * @returns {array} x and y dimensions
 */
export const getSquareDimensions = (e) => {
  const pX = e.target.parentNode.clientWidth;
  const pY = e.target.parentNode.clientHeight;

  const x = pX/9;
  const y = pY/8;

  return [x, y];
};

/**
 * Gets the current location of the cursor
 *
 * It divides the respective coordinates by the respective dimensions
 * in order to place the center of the element, the piece, right on the
 * tip of the cursor, as opposed to snapping the piece's bottom right
 * edge into the tip of the cursor.
 *
 * @returns {array} x and y coordinates
 */
export const getCursorCoordinates = (e) => {
  const [sW, sH] = getSquareDimensions(e);
  const [x, y] = getCurrentCoordinates(e);

  const adjustedX = x - (sW/2);
  const adjustedY = y - (sH/2);

  return [adjustedX, adjustedY];
};
