// Import libraries to help create a component
import React from 'react';
import { View, Image, Text } from 'react-native';
import Swipeout from 'react-native-swipeout';

import { LoadingImage } from './common';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const deleteImage = require('../images/ic_delete.png');

// Make a component
const RewardInactiveDetail = ({ reward, swipeHandler }) => {
  const {
    containerStyle, thumbnailStyle,
    headerTextStyle, subHeaderTextStyle
  } = styles;
  
  const swipeButtons = [
    {
      component: (
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgb(251,60,56)',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}
        >
          <Image style={{ height: 24, width: 24, tintColor: 'white' }} source={deleteImage} />
        </View>),
      onPress: () => {
        // Log reward delete on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
          'reward_delete'
        );

        swipeHandler(reward);
      }
    }
  ];

  return (
    <Swipeout
      backgroundColor='white'
      right={swipeButtons}
    >
      <View style={containerStyle}>
        <LoadingImage
          style={thumbnailStyle}
          sourceUri={reward.Image.MDPI}
          borderRadius={5}
        />
        <View
          style={{
            flex: 2,
            flexDirection: 'column',
            marginLeft: 10,
            justifyContent: 'center'
          }}
        >
          <Text style={headerTextStyle}>{reward.Title}</Text>
          <Text style={subHeaderTextStyle} numberOfLines={2}>{reward.Description}</Text>
          {renderExpirationDate(reward)}
        </View>
      </View>
    </Swipeout>
  );
};

function renderExpirationDate(reward) {
  if (reward.Redeemed) {
    return <Text style={{ fontWeight: 'bold' }}>Usado em: {formatDate(reward.RedeemedAt)}</Text>;
  }

  return <Text style={{ fontWeight: 'bold' }}>Expirou em: {formatDate(reward.ExpirationAt)}</Text>;
}

function formatDate(stringDate) {
  const date = new Date(stringDate);

  return date.toLocaleDateString('pt-BR');
}

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    opacity: 0.3
  },
  thumbnailStyle: {
    flex: 1,
    height: 120,
    width: 120,
    resizeMode: 'stretch',
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18,
    color: '#191919',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  subHeaderTextStyle: {
    fontSize: 16,
    color: '#bbb',
    backgroundColor: 'transparent',
  }
};

// Make the component available to other parts of the app
export default RewardInactiveDetail;
