// Import libraries to help create a component
import React from 'react';
import { View, Text } from 'react-native';

import { PointsPill, RewardImage } from './common';

// Make a component
const HomeCloseRewardDetail = ({ reward, points }) => {
  const {
    containerStyle,
    headerTextStyle,
    subHeaderTextStyle,
    thumbnailStyle
  } = styles;

  return (
    <View style={containerStyle}>
      <RewardImage
        source={reward.Image.MDPI}
        points={reward.Price}
        style={thumbnailStyle}
      />
      <View style={{ marginLeft: 5 }}>
        <Text style={headerTextStyle}>{reward.Title}</Text>
        <Text
          numberOfLines={2}
          style={subHeaderTextStyle}
        >
          {reward.Description}
        </Text>
        <PointsPill points={reward.PriceMissing} />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    width: 200,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: 15
  },
  headerTextStyle: {
    color: '#191919',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  subHeaderTextStyle: {
    marginBottom: 5,
    backgroundColor: 'transparent'
  }
};

// Make the component available to other parts of the app
export default HomeCloseRewardDetail;
