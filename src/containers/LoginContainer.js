import React, { Component } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import axios from 'axios';
import qs from 'qs';

import { logInWithEmail } from '../actions';

import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import { BackButton } from '../components/common';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class LoginContainer extends Component {
  static navigationOptions = () => ({
    header: null
  });

  constructor() {
    super();

    this.emailHandler = this.emailHandler.bind(this);
    this.passwordHandler = this.passwordHandler.bind(this);
  }

  state = { email: null, password: null, loading: false };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('LogIn');
          }
        );
  }

  componentWillUnmoun() {
    didFocusSubscription.remove();
  }

  goToMainScreen() {    
    this.props.navigation.navigate({ routeName: 'Main' })
  }

  loginHandler() {    
    const {
      email,
      password
    } = this.state;

    if (email == null || password == null) {
      Alert.alert(
        'Insira todos os dados',
        'Por favor, insira email e senha válidos para entrar na sua conta.',
        [
          { text: 'Ok' }
        ]
      );
      return;
    }

    this.setState({ loading: true });
    this.props.logInWithEmail(email, password, (error) => {
      this.setState({ loading: false });      
      if (error) {        
        console.log(error)
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'log_in'
        );

        Alert.alert(
          'Erro ao entrar na conta',
          error.Message,
          [
            { text: 'Ok' }
          ]
        );
        return;
      }

      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
        'log_in'
      );
      
      this.goToMainScreen()
    })
  }

  emailHandler(email) {
    this.setState({ email });
  }

  passwordHandler(password) {
    this.setState({ password });
  }

  goToSignUpScreen() {
    this.props.navigation.navigate('SignUp');
  }

  goToRecoverScreen() {
    this.props.navigation.navigate('Recover');
  }

  render() {
    const { loginContainerStyle, loadingStyle } = styles;

    return (
      <View style={loginContainerStyle}>
        <BackButton 
          onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
        />
        <Logo />
        <LoginForm
          onLoginPress={this.loginHandler.bind(this)}
          onEmailChanged={this.emailHandler.bind(this)}
          onPasswordChanged={this.passwordHandler.bind(this)}
          goToSignUpScreen={this.goToSignUpScreen.bind(this)}
          goToRecoverScreen={this.goToRecoverScreen.bind(this)}
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

export default connect(null, { logInWithEmail })(LoginContainer);
