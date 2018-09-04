import React, { Component } from 'react';
import { FlatList, Alert, View, Text } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import NotificationDetail from '../components/NotificationDetail';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class NotificationsContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);

    return {
      headerTitle: 'Notifcações',
      headerRight: <View />
    };
  };


  state = {
    isLoading: false
  }

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('NotificationsList');
          }
        );
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  singleNotificationHandler(item) {
    console.log('notifItem', item);
    axios.post(`${Constants.SERVER_URL}PostNotifyReadMessage?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.userId,
          notifyId: item.Id
        })}`)
      .then(response => {
        const data = response.data;

        if (data.HttpStatus === 200) {
          let list = this.props.notifications.slice(0);
          list = list.filter((n) => n.Id !== item.Id);

          const notification = item;
          notification.Read = true;

          list.push(notification);

          this.props.setNotifications(list);
        }
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

    this.props.navigation.navigate('SingleNotification', { item });
  }

  loadNotifications() {
    this.setState({ isLoading: true });

    axios.post(`${Constants.SERVER_URL}PostNotifyByUser?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.userId,
          page: 1
        })}`)
      .then(response => {
        const data = response.data;

        if (data.HttpStatus === 200) {
          this.props.setNotifications(data.Notifys);
        } else {
          Alert.alert(
            'Ocorreu um erro!',
            data.Message,
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
        this.setState({ isLoading: false });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }

  keyExtractor = (item) => item.id;

  renderItem({ item }) {
    return (
      <NotificationDetail
        id={item.Id}
        item={item}
        onClickHandler={this.singleNotificationHandler.bind(this)}
      />
    );
  }

  renderEmptyState() {
    return (  
      <View> 
        <Text
          style={{
           textAlign: 'center',
           marginTop: 20,
          }}
        > 
          Você não possui nenhuma notificação
        </Text>
      </View>
    );
  }

  render() {
    if (this.props.notifications.length <= 0) {
      return this.renderEmptyState(); 
    }
    
    return (
      <FlatList
        data={this.props.notifications}
        renderItem={this.renderItem.bind(this)}
        style={{ backgroundColor: 'white' }}
        keyExtractor={this.keyExtractor}
        onRefresh={() => {
          // Log pull to refresh on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.PULL_TO_REFRESH,
            'notifications_list'
          );

          this.loadNotifications.bind(this);
        }}
        refreshing={this.state.isLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
	userId: state.loggedUser.Id,
  notifications: state.notifications
});

export default connect(mapStateToProps, actions)(NotificationsContainer);
