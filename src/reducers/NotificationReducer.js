export default (state = [], action) => {
  switch (action.type) {
    case 'set_notifications':
      return action.payload;
    case 'log_out':
      return [];
    default:
      return state;
  }
};
