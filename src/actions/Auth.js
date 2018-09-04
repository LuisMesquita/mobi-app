import { AsyncStorage } from 'react-native';
import OneSignal from 'react-native-onesignal';
import Constants from '../constants/Constants';

import { handleResponse } from './Utils';
import endPoints from '../api/endPoints';
import { request } from '../api';

import {
  LOGIN_USER_STARTED,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,

  LOGOUT_USER_SUCCESS,
} from './types';

const LOGIN_TYPE_KEY = 'mobiclub-login-type';
const USER_EMAIL_PWD_KEY = 'mobiclub-email/pwd';
const USER_FACEBOOK_DATA_KEY = 'mobiclub-facebook-data';

const sendOneSignalTags = (userId) => {
  const tags = {
    user_id: `${Constants.appUserTag}${userId}`,
    app: Constants.onesignalTagApp
  };
  OneSignal.sendTags({
    ...tags
  });
  OneSignal.promptLocation();
}

export const checkIfLogged = (callback) => {
  return (dispatch) => {
    AsyncStorage.getItem(LOGIN_TYPE_KEY)
      .then(typeRes => {        
        if (typeRes !== null) {
          AsyncStorage.getItem(typeRes)
            .then(res => {                    
              callback({
                type: typeRes, 
                val: res
              });
              return;
            })
            .catch(err => callback(err));
        } else {
          callback(null)
        }
      })
      .catch(err => callback(err));      
  };
};

export const logInWithEmail = (email, password, callback) => {
  return (dispatch) => {     
    request(endPoints().login, 'post', { email, password })
      .then((response) => {             
        const logInData = response.data;                
        AsyncStorage.multiSet([
          [LOGIN_TYPE_KEY, USER_EMAIL_PWD_KEY],
          [USER_EMAIL_PWD_KEY, `${email}/${password}`]
        ], (error) => {
          if (!error) {               
            sendOneSignalTags(logInData.User.Id);
            handleResponse(dispatch, LOGIN_USER_SUCCESS, logInData.User);
            callback();
          } else {                         
            handleResponse(dispatch, LOGIN_USER_FAIL, error);
            callback();
          }
        });        
      })
      .catch((error) => {        
        handleResponse(dispatch, LOGIN_USER_FAIL, error);
        callback(error);
      });
  };
};


export const logOut = () => {
  return (dispatch) => {
    OneSignal.deleteTag("user_id");
    OneSignal.deleteTag("app");
    AsyncStorage.multiRemove([LOGIN_TYPE_KEY, USER_EMAIL_PWD_KEY], () => {
      handleResponse(dispatch, LOGOUT_USER_SUCCESS);
    });
  };
};

export const logInWithFacebook = (facebookData, callback) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER_STARTED });
    request(endPoints().loginFb, 'post', facebookData)
      .then((response) => {        
        const logInData = response.data;        
        AsyncStorage.multiSet([
          [LOGIN_TYPE_KEY, USER_FACEBOOK_DATA_KEY],
          [USER_FACEBOOK_DATA_KEY, facebookData]
        ], (error) => {            
          if (!error) {                 
            sendOneSignalTags(logInData.User.Id);
            handleResponse(dispatch, LOGIN_USER_SUCCESS, logInData.User);
            callback();
          } else {
            handleResponse(dispatch, LOGIN_USER_FAIL);
            callback();
          }
        });
      })
      .catch((error) => {
        handleResponse(dispatch, LOGIN_USER_FAIL, error);
        callback(error);
      });
  };
};