import React from 'react';
import { View, Text } from 'react-native';

const PointsPill = ({ points }) => {
  const { containerStyle, textStyle } = styles;

  return (
      <View style={containerStyle}>
        <Text style={textStyle}>Faltam {points} pts</Text>
      </View>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FC5B5F',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: -2
  },
  textStyle: {
    color: 'white',
    fontSize: 12,
    // marginLeft: 5,
    // backgroundColor: 'blue'
  }
};

export { PointsPill };
