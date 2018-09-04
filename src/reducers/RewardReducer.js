export default (state = [], action) => {
  switch (action.type) {    
    case 'set_rewards':
    	return action.payload  
    default:
      	return state;
  }
};
