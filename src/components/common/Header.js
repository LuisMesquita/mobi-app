// Import libraries to help create a component
import React from 'react';
import { View, Image } from 'react-native';
import Colors from '../../constants/Color';

const logoImage = require('../../images/logo.png');
const notificationImage = require('../../images/ic_notifications.png');

// Make a component
const Header = () => {
  const { viewStyle, imageStyle, notificationStyle } = styles;

  return (
      <View style={viewStyle}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center' }}>
          <Image source={logoImage} style={imageStyle}/>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Image source={notificationImage} style={notificationStyle} />
        </View>
      </View>
  );
};

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 4,
    position: 'relative'
  },
  imageStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor: '#000'
  },
  notificationStyle: {
    height: 24,
    width: 24,
    margin: 12
  }
};

// Make the component available to other parts of the app
export { Header };
