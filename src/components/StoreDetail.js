// Import libraries to help create a component
import React from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import { DistancePill } from './common';

const favoriteImage = require('../images/favorite_selected.png');
const detailImage = require('../images/arrow_right.png');

// Make a component
const StoreDetail = ({ franchise, store, favorite, onClickHandler }) => {
  const {
    containerStyle, thumbnailContainerStyle, thumbnailStyle,
    headerTextStyle, headerTextSecondStyle,
  } = styles;

  return (
    <TouchableHighlight
      onPress={
        () => {
          console.log(store);
          onClickHandler(store);
        }
      }
      underlayColor='white'
    >
      <View style={containerStyle}>
        <View style={thumbnailContainerStyle}>
          <Image
            style={thumbnailStyle}
            source={{ uri: store.LogoURL }}
          />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={headerTextSecondStyle}>
            {store.Name}
          </Text>
          <View
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 5
            }}
          >
            { store.Distance !== 0 &&
              <DistancePill distance={store.Distance.toFixed(2).toString()} />
            }
            {
              favorite &&
              <Image
                style={{ height: 16, width: 16, tintColor: '#e8c252' }}
                source={favoriteImage}
              />
            }
          </View>
        </View>
        <View
          style={{
            flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'
          }}
        >
          <Image
            style={{ tintColor: 'gray', width: 24, height: 24 }}
            source={detailImage}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },
  thumbnailContainerStyle: {
    height: 60,
    width: 60,
    marginRight: 10,
    marginLeft: 8,

    backgroundColor: 'rgba(0,0,0,0)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  thumbnailStyle: {
    height: 60,
    width: 60,
    borderRadius: 5,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  headerTextStyle: {
    fontSize: 18
  },
  headerTextSecondStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
};

// Make the component available to other parts of the app
export default StoreDetail;
