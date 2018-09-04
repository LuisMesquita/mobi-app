// Import libraries to help create a component
import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import Colors from '../constants/Color';

const giftIcon = require('../images/gift_icon.png');

// Make a component
const GiftButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Image
        source={giftIcon}
        style={{
          width: 36,
          height: 36
        }}
      />
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.primary,
    padding: 10
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 22,
    marginLeft: 10
  }
};

// Make the component available to other parts of the app
export default GiftButton;
