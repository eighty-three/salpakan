export const getCurrentCoordinates = (e) => {
  let eventX, eventY;
  if (e.changedTouches) {
    eventX = e.changedTouches[0].clientX;
    eventY = e.changedTouches[0].clientY;
  } else if (e.clientX && e.clientY) {
    eventX = e.clientX;
    eventY = e.clientY;
  }

  const offset = e.target.parentNode.getBoundingClientRect();
  const x = eventX - offset.left;
  const y = eventY - offset.top;

  return [x, y];
};

export const getSquareDimensions = (e) => {
  const pX = e.target.parentNode.clientWidth;
  const pY = e.target.parentNode.clientHeight;

  const x = pX/9;
  const y = pY/8;

  return [x, y];
};

export const getCursorCoordinates = (e) => {
  const [sW, sH] = getSquareDimensions(e);
  const [x, y] = getCurrentCoordinates(e);
  const adjustedX = x - (sW/2);
  const adjustedY = y - (sH/2);

  return [adjustedX, adjustedY];
};
