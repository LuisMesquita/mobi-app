import {
  SET_ROOT_NAVIGATION,  
} from '../actions/types';

const INITIAL_STATE = {
  rootNavigation: null,  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ROOT_NAVIGATION:
      return {
        ...state,
        rootNavigation: action.payload
      };

    default:
      return state;
  }
};
