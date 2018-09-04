// Import libraries to help create a component
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import ptLocale from 'date-fns/locale/pt';

const detailImage = require('../images/arrow_right.png');

// Make a component
class NotificationDetail extends Component {

  renderContainer(item) {
    console.log('notificação', item);
    if (item.Read) {
      return (
        <View
          style={{ ...styles.containerStyle, opacity: 0.5 }}
        >
          <Image
            style={styles.thumbnailStyle}
            source={{ uri: item.LogoUrl }}
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
            <Text style={styles.headerTextStyle}>{item.Title}</Text>
            <Text
              style={styles.descriptionTextStyle}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {item.Text}
            </Text>
            <Text style={styles.priceTextStyle}>
              {item.From}
            </Text>
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
          <Text
            style={{ position: 'absolute', top: 20, right: 20, fontSize: 12, color: 'gray' }}
          >
            {this.renderDate(item.SendAt)}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={styles.containerStyle}
      >
        <View
          style={{
            height: 8,
            width: 8,
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
            borderRadius: 4,
            position: 'absolute',
            left: 8,
            alignSelf: 'center',
          }}
        />
        <Image
          style={styles.thumbnailStyle}
          source={{ uri: item.LogoUrl }}
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
          <Text style={styles.headerTextStyle}>{item.Title}</Text>
          <Text
            style={styles.descriptionTextStyle}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {item.Text}
          </Text>
          <Text style={styles.priceTextStyle}>
            {item.From}
          </Text>
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
        <Text
          style={{
            position: 'absolute',
            top: 10,
            lineHeight: 22,
            right: 20,
            fontSize: 12,
            color: 'gray'
          }}
        >
          {this.renderDate(item.SendAt)}
        </Text>
      </View>
    );
  }

  renderDate(date) {
    return distanceInWordsStrict(new Date(), new Date(date), { locale: ptLocale });
  }

  render() {
    const { item, onClickHandler } = this.props;

    return (
      <TouchableOpacity
        onPress={
          () => {
            onClickHandler(item);
          }
        }
      >
        {this.renderContainer(item)}
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  thumbnailStyle: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    resizeMode: 'stretch',
    borderRadius: 5
  },
  headerTextStyle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#222',
    paddingRight: 20
  },
  descriptionTextStyle: {
    marginTop: 5,
    fontSize: 14,
    color: '#222',
    paddingRight: 20
  },
  priceTextStyle: {
    marginTop: 5,
    fontSize: 14,
    color: '#aaa'
  }
};

// Make the component available to other parts of the app
export default NotificationDetail;
