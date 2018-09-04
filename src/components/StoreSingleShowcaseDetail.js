// Import libraries to help create a component
import React from 'react';
import { View, Text } from 'react-native';

import ReclaimButton from './ReclaimButton';
import Colors from '../constants/Color';
import { LoadingImage } from './common';

// Make a component
const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const StoreSingleShowcaseDetail = ({ showcase, onClickHandler, currentPoints }) => {
  const { thumbnail_image_url, name, description, id, points } = showcase;
  const missing =  showcase.points - currentPoints
  console.log(missing)
  
  const {
    containerStyle, thumbnailStyle,
    headerTextStyle, subHeaderTextStyle
  } = styles;

  return (
    <View style={containerStyle}>
      <LoadingImage
        style={thumbnailStyle}
        sourceUri={thumbnail_image_url}
        borderRadius={5}
      />
      <View style={{ justifyContent: 'flex-start' }}>
        <Text style={headerTextStyle}>
          {name}
        </Text>
        <Text numberOfLines={3} style={subHeaderTextStyle}>
          {description}
        </Text>
        <ReclaimButton
          missing={missing}
          points={points}
          onPress={() => onClickHandler(id, thumbnail_image_url, name, description)}
        />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'flex-start',
    borderColor: '#ddd',
    position: 'relative'
  },
  thumbnailStyle: {    
    height: window.width * 6.5/10,
    flex: 1,
    width: null,
  },
  headerTextStyle: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: 'transparent'
  },
  subHeaderTextStyle: {
    fontSize: 16,
    color: '#aaa',
    marginLeft: 5,
  }
};

// Make the component available to other parts of the app
export default StoreSingleShowcaseDetail;
