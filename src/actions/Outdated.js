export const setCurrentPoints = (currentPoints) => ({
  type: 'set_points',
  payload: currentPoints
});

export const setRewards = (rewards) => ({
  type: 'set_rewards',
  payload: rewards
});

export const removePoints = (points) => ({
  type: 'remove_points',
  payload: points
});

export const setUser = (user) => {  
  return {
    type: 'set_user',
    payload: user
  }
};

export const setLocation = (location) => ({
  type: 'set_location',
  payload: location
});

export const setStores = (stores) => ({
  type: 'set_stores',
  payload: stores
});

export const setFranchise = (franchise) => ({
  type: 'set_franchise',
  payload: franchise
});

export const setNotifications = (notifications) => ({
  type: 'set_notifications',
  payload: notifications
});

