import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

const arrowRightImage = require('../../images/arrow_right.png');

const TextLink = ({ title, onPress, containerStyle }) => {
  const { 
    containerStyle: myContainerStyle, 
    textStyle,
    imageStyle
  } = styles;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{ ...myContainerStyle, ...containerStyle }}
      >
        <Text style={textStyle}>
          {title}
        </Text>
        <Image
          style={imageStyle}
          source={arrowRightImage}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  textStyle: {
    color: 'gray', 
    fontSize: 14, 
    textDecorationLine: 'underline'
  },
  imageStyle: {
    width: 14,
    height: 14,
    tintColor: 'gray'
  }
};

export { TextLink };
