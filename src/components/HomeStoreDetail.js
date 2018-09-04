// Import libraries to help create a component
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { DistancePill, LoadingImage } from './common';

// Make a component
const HomeStoreDetail = ({ store, onClickHandler }) => {
  const {
    containerStyle, thumbnailStyle,
    headerTextStyle
  } = styles;  


  return (    
    <TouchableHighlight
      onPress={
        () => {
          onClickHandler(store);
        }
      }
      underlayColor='white'
    >
      <View style={containerStyle}>
        <LoadingImage
          style={thumbnailStyle}
          sourceUri={store.CoverURL}
          resizeMode='cover'
          borderRadius={4}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={headerTextStyle}>{store.Name}</Text>
          <Text style={{ marginBottom: 5 }}>{(store.Address != null && store.Address.District != '')? store.Address.District + ', ' + store.Address.City : ''  }</Text>
          { store.Distance !== 0 &&
            <DistancePill distance={store.Distance.toFixed(2).toString()} />
          }
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    // paddingTop: 5,
    // paddingBottom: 5,
    // paddingLeft: 10,
    // paddingRight: 10
    marginHorizontal: 15,
  },
  thumbnailStyle: {
    height: 200,
    width: 200,
    marginBottom: 5
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
};

// Make the component available to other parts of the app
export default HomeStoreDetail;
