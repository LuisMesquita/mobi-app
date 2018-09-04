function removePoints(previousPoints, pointsToRemove) {
  let newPoints = previousPoints - pointsToRemove;
  if (newPoints < 0) {
    newPoints = 0;
  }
  return newPoints;
}

export default (state = null, action) => {
  switch (action.type) {
    case 'set_points':
      return action.payload;
    case 'remove_points':
      return removePoints(state, action.payload);
    case 'log_out':
      return null;
    default:
      return state;
  }
};
