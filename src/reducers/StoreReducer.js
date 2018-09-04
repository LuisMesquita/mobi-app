export default (state = [], action) => {
  switch (action.type) {
    case 'set_stores':
      return action.payload;    
    default:
      return state;
  }
};
