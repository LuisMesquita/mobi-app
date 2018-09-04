import React, { Component } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import * as actions from '../actions';

import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import Logo from '../components/Logo';
import RecoverForm from '../components/RecoverForm';
import { BackButton } from '../components/common';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class RecoverContainer extends Component {
  static navigationOptions = () => ({
    header: null
  });

  constructor() {
    super();

    this.emailHandler = this.emailHandler.bind(this);   
  }

  state = { email: '', loading: false };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('PasswordRecovery');
          }
        );
  }

  componentWillUnmoun() {
    didFocusSubscription.remove();
  }

  recoverHandler() {
    console.log('state', this.state);

    this.setState({ loading: true });

    axios.post(`${Constants.SERVER_URL}PostRequestPassword?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          email: this.state.email,          
        })}`)
      .then(response => {
        const data = response.data;
        console.log('recover_data', data);

        if (data.HttpStatus === 200) {
          // Log pass recover success on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
            'password_recover'
          );

          this.setState({ loading: false });
          Alert.alert(
            data.Title,
            data.Message,
            [
              { text: 'Ok', onPress: this.goToLoginScreen.bind(this) },
            ],
            { cancelable: false }
          );
        } else {
          // Log pass recover failure on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
            'password_recover'
          );

          this.setState({ loading: false });
          Alert.alert(
            data.Title,
            data.Message,
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        // Log pass recover failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'password_recover'
        );

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

  emailHandler(email) {
    this.setState({ email });
  } 

  goToLoginScreen() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  render() {
    const { loginContainerStyle, loadingStyle } = styles;

    return (
      <View style={loginContainerStyle}>
        <BackButton onPress={this.goToLoginScreen.bind(this)} />
        <Logo />
        <RecoverForm
          onRecoverPress={this.recoverHandler.bind(this)}
          onEmailChanged={this.emailHandler.bind(this)}
          goToLoginScreen={this.goToLoginScreen.bind(this)}
        />        
        {this.state.loading &&
          <View style={loadingStyle}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
      </View>
    );
  }
}

const styles = {
  loginContainerStyle: {
    flex: 1,
    alignContent: 'space-between',
    backgroundColor: Colors.container_background
  },
  loadingStyle: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.7,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default connect(null, actions)(RecoverContainer);