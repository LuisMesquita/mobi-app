export default (state = { latitude: 0, longitude: 0 }, action) => {
  switch (action.type) {
    case 'set_location':
      return action.payload;
    default:
      return state;
  }
};
