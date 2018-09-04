import React, { Component } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';

export const isIphoneX = () => {
  const d = Dimensions.get('window');
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === 'ios' &&

    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};

export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return isIphoneX() ? 74 : 20;
  }
  // Android
  return StatusBar.currentHeight;
};

export const formatDate = (date) => {
	const day = date.getDate()
		.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
	const month = (date.getMonth() + 1)
		.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
	const year = date.getFullYear().toString().substr(-2);

	return `${day}/${month}/${year}`;
};

export const mapNavigationStateParamsToProps = (SomeComponent) => {
    return class extends Component {
        static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
        render() {
            const { navigation: { state: { params } } } = this.props;
            return <SomeComponent {...params} {...this.props} />;
        }
    };
};

export const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};
