import {
  SET_ROOT_NAVIGATION,
} from './types';

export const setRootNavigation = (rootNavigation) => {
  return {
    type: SET_ROOT_NAVIGATION,
    payload: rootNavigation
  };
};
