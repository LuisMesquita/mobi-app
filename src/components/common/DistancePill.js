import React from 'react';
import { View, Image, Text } from 'react-native';
import Colors from '../../constants/Color';

const distanceImage = require('../../images/distance.png');

const DistancePill = ({ distance }) => {
  const { containerStyle, imageStyle, textStyle } = styles;

  return (
      <View style={containerStyle}>
        <Image style={imageStyle} source={distanceImage} />
        <Text style={textStyle}>{distance.replace('.', ',')} km</Text>
      </View>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    padding: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.distance_pill_background,
    alignItems: 'center',
    borderRadius: 16,
    marginRight: 10,
  },
  imageStyle: {
    width: 10,
    height: 10,
    tintColor: 'white'
  },
  textStyle: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5
  }
};

export { DistancePill };
