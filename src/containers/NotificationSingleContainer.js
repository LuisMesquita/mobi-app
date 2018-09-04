import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import format from 'date-fns/format';

import Colors from '../constants/Color';
import { MobiAnalytics } from '../helpers/Analytics';

// const storeImage = require('../images/mini_logo.png');
let didFocusSubscription = null;

class NotificationSingleContainer extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Notificações',
    headerRight: <View />
  });

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('NotificationDetails');
          }
        );
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  renderHeader(item) {
    return (
      <View style={{ padding: 15, borderBottomWidth: 1, borderColor: 'lightgray' }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Text 
            style={{
              fontSize: 20,
              color: Colors.primary,
              fontWeight: 'bold',
              width: '80%'
            }}
            ellipsizeMode='tail'
            numberOfLines={2}
          >
            {item.Title}
          </Text>
          <Text
            style={{ 
              fontSize: 12,
              color: 'gray',
              width: '25%'
            }}
          >
            {format(item.SendAt, 'DD/MM/YYYY')}
          </Text>
        </View>
        <Text style={{ fontSize: 16, color: 'gray' }}>{item.From}</Text>
      </View>
    );
  }

  renderMessages(item) {    
    return (
      <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
        <Image
          style={{ height: 40, width: 40, borderRadius: 4, resizeMode: 'cover' }}
          source={{ uri:item.LogoUrl }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              padding: 10,
              backgroundColor: '#dedede',
              borderRadius: 4,
              borderTopLeftRadius: 0
            }}
          >
            {item.Text}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    // console.log('NotificationSingleContainer_props', this.props);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {this.renderHeader(this.props.navigation.state.params.item)}
        {this.renderMessages(this.props.navigation.state.params.item)}
      </View>
    );
  }
}

const styles = {
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
};

export default NotificationSingleContainer;
