import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';

import HomeNavigator from '../navigators/HomeNavigator';

class HomeScreen extends Component {

  componentWillMount() {
    const viewedTutorialKey = 'haveViewedTutorial';
    AsyncStorage.getItem(viewedTutorialKey, (error, result) => {
      if (!result || error) {
        this.props.navigation.navigate('Tutorial');
        AsyncStorage.setItem(viewedTutorialKey, '1', null);
      }
    });
  }


  navigateTab(route, params) {
    this.props.navigation.navigate(route, params);
  }

	render() {
		return (
			<View style={{ flex: 1 }}>
        <HomeNavigator
          screenProps={{
            navigateTab: this.navigateTab.bind(this),
            handleNotifications: this.props.screenProps.handleNotifications,
            handleLogin: this.props.screenProps.handleLogin,
            handleWarning: this.props.screenProps.handleWarning
          }}
        />
			</View>
		);
	}
}

export default HomeScreen;
