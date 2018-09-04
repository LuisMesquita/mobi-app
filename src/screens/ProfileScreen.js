import React, { Component } from 'react';
import { View } from 'react-native';

import ProfileNavigator from '../navigators/ProfileNavigator';

class ProfileScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ProfileNavigator
          screenProps={{
            handleLogout: this.props.screenProps.handleLogout,
            handleLogin: this.props.screenProps.handleLogin,
            handleNotifications: this.props.screenProps.handleNotifications
          }}
        />
      </View>
    );
  }
}

export default ProfileScreen;
