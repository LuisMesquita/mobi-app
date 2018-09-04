import React, { Component } from 'react';
import { View } from 'react-native';

import StoreNavigator from '../navigators/StoreNavigator';

class StoreScreen extends Component {

  constructor() {
    super();

    this.navigateTab = this.navigateTab.bind(this);
  }

  navigateTab(route, params) {
    this.props.navigation.navigate(route, params);
  }

	render() {
    console.log('thisprops', this.props);
		return (
			<View style={{ flex: 1 }}>
        <StoreNavigator
          screenProps={{
            navigateTab: this.navigateTab.bind(this),
            handleNotifications: this.props.screenProps.handleNotifications,
            handleLogin: this.props.screenProps.handleLogin
          }}
        />
			</View>
		);
	}
}

export default StoreScreen;
