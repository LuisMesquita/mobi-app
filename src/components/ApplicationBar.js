import React, { Component } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { Header } from './common';
import Colors from '../constants/Color';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class ApplicationBar extends Component {
  state = {
    notifications: 0
  };

  render() {
    return (
      <View>
        <MyStatusBar backgroundColor={Colors.status_bar_background} barStyle="light-content" />
        <View style={styles.appBar}>
          <Header />
        </View>
      </View>
    );
  }
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = {
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    height: APPBAR_HEIGHT
  }
};

export default ApplicationBar;
