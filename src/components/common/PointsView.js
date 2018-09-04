import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/Color';

const PointsView = ({ points, backgroundColor, textColor, borderColor }) => {
  const { baseContainerStyle, baseTextStyle, basePointsStyle } = styles;

  const containerStyle = Object.assign({}, baseContainerStyle);
  containerStyle.backgroundColor = backgroundColor;
  containerStyle.borderColor = borderColor;
  const pointsStyle = Object.assign({}, basePointsStyle);
  pointsStyle.color = textColor;

  return (
      <View style={containerStyle}>
        <Text style={pointsStyle}>{points}</Text>
        <Text style={baseTextStyle}>pts</Text>
      </View>
  );
};

const styles = {
  baseContainerStyle: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 8,
    alignContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2
  },
  basePointsStyle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  baseTextStyle: {
    color: Colors.points_view_basetext,
    lineHeight: 24,
    alignSelf: 'flex-end',
    marginLeft: 5
  }
};

export { PointsView };
