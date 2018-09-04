import React from 'react';
import {
	View,
  Text
} from 'react-native';
import Colors from '../../constants/Color';

import { LoadingImage } from '../common';

const RewardImage = ({ source, points }) => {
  const {
    containerStyle,
    textStyle,
    pointsStyle,
    thumbnailStyle
  } = styles;

	return (
    <View style={{ flex: 1, width: 200, height: 200, marginBottom: 5 }}>
      <LoadingImage
        style={thumbnailStyle}
        sourceUri={source}
        resizeMode='stretch'
        borderRadius={4}
      />
      <View style={containerStyle}>
        <Text style={pointsStyle}>{points}</Text>
        <Text style={textStyle}>pts</Text>
      </View>
    </View>
	);
};

const styles = {
	containerStyle: {
    flexDirection: 'row',
    margin: 10,
    padding: 5,
    borderRadius: 5,    
    elevation: 5,
    alignSelf: 'flex-end',
		justifyContent: 'flex-end',
    backgroundColor: Colors.points_view_background
	},
  thumbnailStyle: {
    width: 200,
    height: 200,
    position: 'absolute',
    borderRadius: 10,
    justifyContent: 'center'
  },
	pointsStyle: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: Colors.points_view_text,
  },
  textStyle: {
    color: Colors.points_view_basetext,
    lineHeight: 24,
    alignSelf: 'flex-end',
    marginLeft: 5
	}
};

export { RewardImage };
