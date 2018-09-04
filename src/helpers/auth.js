import { AsyncStorage } from 'react-native';
import OneSignal from 'react-native-onesignal';

export const LOGIN_TYPE_KEY = 'mobiclub-login-type';
export const USER_EMAIL_PWD_KEY = 'mobiclub-email/pwd';
export const USER_FACEBOOK_DATA_KEY = 'mobiclub-facebook-data';

export const onSignIn = (email, pwd) => {
  AsyncStorage.setItem(LOGIN_TYPE_KEY, USER_EMAIL_PWD_KEY);
  AsyncStorage.setItem(USER_EMAIL_PWD_KEY, `${email}/${pwd}`);
};

export const onFbSignIn = (facebookData) => {
  AsyncStorage.setItem(LOGIN_TYPE_KEY, USER_FACEBOOK_DATA_KEY);
  AsyncStorage.setItem(USER_FACEBOOK_DATA_KEY, facebookData);
};

export const onSignOut = () => {
  AsyncStorage.removeItem(LOGIN_TYPE_KEY);
  AsyncStorage.removeItem(USER_EMAIL_PWD_KEY);
  OneSignal.deleteTag("user_id");
  OneSignal.deleteTag("app");
};

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(LOGIN_TYPE_KEY)
      .then(typeRes => {
        if (typeRes !== null) {
          AsyncStorage.getItem(typeRes)
            .then(res => {
              resolve({ type: typeRes, val: res });
            })
            .catch(err => reject(err));
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
