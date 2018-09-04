// Import libraries to help create a component
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/Color';

const linkImage = require('../images/mini_logo.png');

// Make a component
const LinkButton = ({ onPress }) => {
  const { buttonStyle, imageStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Image
        source={linkImage}
        style={imageStyle}
      />
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  imageStyle: {
    alignSelf: 'center',
    width: 60,
    height: 60
  }
};

// Make the component available to other parts of the app
export default LinkButton;
