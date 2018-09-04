import React, { Component } from 'react';
import { View } from 'react-native';
import OneSignal from 'react-native-onesignal';

import RootNavigator from './RootNavigator';
import GiftModal from './modals/GiftModal';

const test = require('./TestGift.json');

OneSignal.configure({});

class RootComponent extends Component<{}> {

  state = {
    modalVisible: false,
    activeModalImage: null,
    activeModalEstablishmentName: null,
    activeModalTitle: null,
		activeModalDescription: null
  };

  componentWillMount() {    
    OneSignal.inFocusDisplaying(0);
  }

  componentDidMount() {
    console.log("Root Did mount")
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
  }

  componentWillUnmount() {
    console.log("Root Will Unmount")
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onReceived(notification) {
    console.log('Notification: ', notification);
    const data = notification.payload.additionalData;
    // const data = test;    

    if (data && data.type === 'gift') {
    // Presente
      this.setState({
        activeModalImage: data.Gift.Image.XDPI,
        activeModalEstablishmentName: data.Gift.Establishment.Name,
        activeModalTitle: data.Gift.Title,
        activeModalDescription: data.Gift.Description,
        modalVisible: true
      });
    }
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    if (this.state.modalVisible === false) {
      const data = openResult.notification.payload.additionalData;
      // const data = test;
      if (data.type === 'gift') {
      // Presente
        this.setState({
          activeModalImage: data.Gift.Image.XDPI,
          activeModalEstablishmentName: data.Gift.Establishment.Name,
          activeModalTitle: data.Gift.Title,
          activeModalDescription: data.Gift.Description,
          modalVisible: true
        });
      }
    }
  }

  hideModal() {
    OneSignal.clearOneSignalNotifications();
    this.setState({ modalVisible: false });
  }

  formatDate(date) {
		const day = date.getDate()
			.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
		const month = (date.getMonth() + 1)
			.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
		const year = date.getFullYear().toString().substr(-2);

		return `${day}/${month}/${year}`;
	}

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RootNavigator />
        <GiftModal
          isVisible={this.state.modalVisible}
          hideModal={this.hideModal.bind(this)}
          giftImage={this.state.activeModalImage}
          giftEstablishmentName={this.state.activeModalEstablishmentName}
          giftTitle={this.state.activeModalTitle}
          giftDescription={this.state.activeModalDescription}
          date={this.formatDate(new Date())}
        />
      </View>
    );
  }
}

export default RootComponent;
