// Import libraries to help create a component
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Button, LoadingImage } from './common';
import Colors from '../constants/Color';

// Make a component
const RewardActiveDetail = ({ reward, onClickHandler }) => {
  const {
    containerStyle, thumbnailStyle,
    headerTextStyle, subHeaderTextStyle
  } = styles;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => onClickHandler(reward)}
    >
      <View style={{ flexDirection: 'row' }}>
        <LoadingImage
          style={thumbnailStyle}
          sourceUri={reward.Image.MDPI}
          resizeMode='cover'
          borderRadius={5}
        />
      </View>
      <View>
        <Text style={headerTextStyle}>{reward.Title}</Text>
        <Text style={subHeaderTextStyle}>{reward.Description}</Text>
        <Button
          buttonColor={Colors.button_background_primary}
          textColor='#fff'
          onPress={
            () => {
              onClickHandler(reward);
            }
          }
        >
          Resgatar recompensa
        </Button>        
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  thumbnailStyle: {
    flex: 1,
    height: 200,
    width: null,
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 22,
    color: '#191919',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 15,
  },
  subHeaderTextStyle: {
    fontSize: 16,
    marginVertical: 7,
    color: '#bbb',
    backgroundColor: 'transparent'
  }
};

// Make the component available to other parts of the app
export default RewardActiveDetail;
