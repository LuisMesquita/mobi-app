import React from 'react';
import { View, StatusBar, Platform } from 'react-native';

const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const CUSTOM_STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = {
  statusBar: {
    height: CUSTOM_STATUS_BAR_HEIGHT,
  }
};

export { CustomStatusBar, CUSTOM_STATUS_BAR_HEIGHT };
