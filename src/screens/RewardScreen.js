import React, { Component } from 'react';
import { View } from 'react-native';

import RewardNavigator from '../navigators/RewardNavigator';

class RewardScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <RewardNavigator
          screenProps={{
            handleNotifications: this.props.screenProps.handleNotifications,
            rewardId: this.props.rewardId
          }}
        />
      </View>
    );
  }
}

export default RewardScreen;
