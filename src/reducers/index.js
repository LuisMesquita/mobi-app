import { combineReducers } from 'redux';

import PointsReducer from './PointsReducer';
import UserReducer from './UserReducer';
import HelperReducer from './HelperReducer';
import LocationReducer from './LocationReducer';
import StoreReducer from './StoreReducer';
import NotificationReducer from './NotificationReducer';
import FranchiseReducer from './FranchiseReducer';
import rewardReducer from './RewardReducer';

export default combineReducers({
  currentPoints: PointsReducer,
  loggedUser: UserReducer,
  helper: HelperReducer,
  location: LocationReducer,
  stores: StoreReducer,
  notifications: NotificationReducer,
  franchise: FranchiseReducer,
  rewards: rewardReducer
});
