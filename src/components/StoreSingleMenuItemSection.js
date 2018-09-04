import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { LoadingImage } from './common';
import { MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class StoreSingleMenuItemSection extends Component {

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('MenuItemDetails');
          }
        );
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

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
    if (prices.length > 0) {
      return prices.map((price) => {
        console.log('RenderPrices', price);
        return (
          <Text style={styles.priceTextStyle} key={price.Size}>
            R$ {price.Price.toFixed(2).replace('.', ',')} - {price.Size}
          </Text>
        );
      });
    }
  }

  render() {
    const { item } = this.props.navigation.state.params;
    console.log('StoreSingleMenuItemSection_render', item);

    return (
      <View
        style={styles.containerStyle}
      >
        <View
          style={styles.thumbnailContainerStyle}
        >
          <LoadingImage
            style={styles.thumbnailStyle}
            sourceUri={item.Image.LDPI}
          />
        </View>
        <View style={styles.textContainerStyle}>
          <Text style={styles.headerTextStyle}>{item.Name}</Text>
          {this.renderDescription(item.Description)}
          {this.renderPrices(item.Prices)}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  thumbnailContainerStyle: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.3,
    elevation: 2
  },
  thumbnailStyle: {
    height: 250,
    // width,
    resizeMode: 'cover'
  },
  textContainerStyle: {
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
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

export default StoreSingleMenuItemSection;
