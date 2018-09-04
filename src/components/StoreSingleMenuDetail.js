// Import libraries to help create a component
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import { LoadingImage } from './common';

const detailImage = require('../images/arrow_right.png');

// Make a component
class StoreSingleMenuDetail extends Component {

  renderDescription(description) {
    if (description !== '') {
      return (
        <Text
          style={styles.descriptionTextStyle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {description}
        </Text>
      );
    }

    return null;
  }

  renderPrices(prices) {
    console.log('RenderPrices', prices.length);
    if (prices.length === 1) {
      return (
        <Text style={styles.priceTextStyle}>
          R$ {prices[0].Price.toFixed(2).replace('.', ',')}
        </Text>
      );
    } else if (prices.length > 1) {
      const min = Math.min(...prices.map((price) => price.Price));

      return (
        <Text style={styles.priceTextStyle}>
          a partir de R$ {min.toFixed(2).replace('.', ',')}
        </Text>
      );
    }
  }

  render() {
    console.log('menu detail item', this.props);
    const { onClickHandler } = this.props;
    const item = this.props.item.item;

    return (
      <TouchableOpacity
        onPress={
          () => {
            onClickHandler(item);
          }
        }
      >
        <View
          style={styles.containerStyle}
        >
          <LoadingImage
            style={styles.thumbnailStyle}
            sourceUri={item.Image.MINI}
            borderRadius={5}
          />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Text style={styles.headerTextStyle}>{item.Name}</Text>
            {this.renderDescription(item.Description)}
            {this.renderPrices(item.Prices)}
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            >
              <Image
              style={{ tintColor: 'gray', width: 24, height: 24 }}
              source={detailImage}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    backgroundColor: 'transparent'
  },
  headerTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },
  descriptionTextStyle: {
    marginTop: 5,
    fontSize: 14,
    color: '#aaa'
  },
  priceTextStyle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa'
  }
};

// Make the component available to other parts of the app
export default StoreSingleMenuDetail;
