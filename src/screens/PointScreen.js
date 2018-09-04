import React, { Component } from 'react';
import { View } from 'react-native';

import PointNavigator from '../navigators/PointNavigator';

class PointScreen extends Component {
  static navigationOptions = () => ({
    tabBarVisible: false
  });

  constructor() {
    super();

    this.returnToHome = this.returnToHome.bind(this);
  }

  returnToHome() {
    // this.props.navigation.navigate('Home');
    this.props.navigation.goBack(null);
  }

	render() {
		return (
			<View style={{ flex: 1 }}>
        <PointNavigator
          screenProps={{
            onBackPressed: this.returnToHome.bind(this)
          }}
        />
			</View>
		);
	}
}

export default PointScreen;
