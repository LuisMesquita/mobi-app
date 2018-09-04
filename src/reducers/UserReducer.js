import {
  SIGNUP_COMPLETE_SUCCESS,
  
  LOGIN_USER_STARTED,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,

  LOGOUT_USER_SUCCESS,
} from '../actions/types';


export default (state = null, action) => {
  switch (action.type) {

    case LOGIN_USER_SUCCESS:      
      return action.payload;

    case LOGIN_USER_FAIL:
      return null

    case LOGOUT_USER_SUCCESS:
      return null;

    default:
      return state;
  }
};
