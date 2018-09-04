export default (state = null, action) => {
  switch (action.type) {
    case 'set_franchise':
      return action.payload;
    default:
      return state;
  }
};
