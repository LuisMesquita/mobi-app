import React, { Component } from 'react';
import { View, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import ProgressBar from 'react-native-progress/Bar';
import axios from 'axios';
import qs from 'qs';

import * as actions from '../actions';
import { onSignIn } from '../helpers/auth';

import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import SignUpStepOne from '../components/SignUpStepOne';
import SignUpStepTwo from '../components/SignUpStepTwo';
import SignUpStepThree from '../components/SignUpStepThree';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

class SignUpContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Criar conta',
    headerLeft: (
        <HeaderBackButton
          tintColor='white'
          onPress={() => navigation.state.params.handleBackPress()}
        />
      ),
    headerStyle: {
      marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      backgroundColor: Colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      elevation: 4,
    }
  });

  state = { step: 0, 
            loading: false, 
            name: null, 
            surname: null, 
            birth: null, 
            cpf: '', 
            email: null,
            gender: null, 
            nameValidation: null, 
            surnameValidation: null,
            birthValidation: null,
            genderValidation: null,
            cpfValidation: null,
            emailValidation: null
          };

  componentWillMount() {
    this.toNextStep = this.toNextStep.bind(this);
    this.toPreviousStep = this.toPreviousStep.bind(this);
    this.finishSignUp = this.finishSignUp.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props);
    this.props.navigation.setParams({ handleBackPress: this.onBackPressed });
  }

  onBackPressed = () => {
    if (this.state.step > 1) {
      this.toPreviousStep();
    } else {
      this.props.navigation.goBack();
    }
  }

  proceedToLogin(user, email, password) {
    console.log(user)
    const tags = {
      user_id: `${Constants.appUserTag}${user.Id}`,
      app: Constants.onesignalTagApp
    };
    OneSignal.sendTags({
      ...tags
    });

    this.props.setUser(user);
    onSignIn(email, password);
    
    this.props.navigation.navigate({ routeName: 'Main' })
  }

  toNextStep(state) {
    this.setState({
      step: this.state.step + 1,
      ...state
    });
  }

  toPreviousStep() {
    this.setState({ step: this.state.step - 1 });
  }

  finishSignUp(state) {
    this.setState({
      loading: true
    });
    
    const birth = (this.state.birth) ? `${this.state.birth.substring(6, 10)}-${
                      this.state.birth.substring(3, 5)}-${
                      this.state.birth.substring(0, 2)}T00:00:00` : '';
    console.log('birarsa', birth)
    axios.post(`${Constants.SERVER_URL}PostCreateUserByEmail?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          name: this.state.name,
          email: state.email,
          surname: this.state.surname,
          gender: this.state.gender,
          password: state.password,
          password2: state.password2,
          birth,
          cpf: this.state.cpf
        })}`)
      .then(response => {
        const data = response.data;

        this.setState({ loading: false });

        if (data.HttpStatus === 200) {
          // Log signup success on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
            'sign_up'
          );        
          this.setState({ step: this.state.step + 1 });

          Alert.alert(
            'Sucesso',
            'Cadastro realizado com sucesso',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.proceedToLogin(data.User, state.email, state.password);
                },
              }
            ],
            { cancelable: false }
          );
        } else {          
          // Log signup failure on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
            'sign_up'
          );

          Alert.alert(
            'Erro',
            data.Message,
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        // Log signup failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'sign_up'
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

  renderPageByIndex() {
    switch (this.state.step) {
      case 0:
        MobiAnalytics.shared().trackScreen('SignUp1');
        return (
          <SignUpStepOne
            toNextStep={this.toNextStep.bind(this)}
            name={this.state.name}
            surname={this.state.surname}
            nameValidation={this.state.nameValidation}
            surnameValidation={this.state.surnameValidation}
          />
        );
      case 1:
        MobiAnalytics.shared().trackScreen('SignUp2');
        return (
          <SignUpStepTwo
            toNextStep={this.toNextStep.bind(this)}
            birth={this.state.birth}
            cpf={this.state.cpf}
            gender={this.state.gender}
            genderIndex={this.state.genderIndex}
            birthValidation={this.state.birthValidation}
            genderValidation={this.state.genderValidation}
            cpfValidation={this.state.cpfValidation}
          />
        );
      case 2:
        MobiAnalytics.shared().trackScreen('SignUp3');
        return (
          <SignUpStepThree
            finishSignUp={this.finishSignUp.bind(this)}
            email={this.state.email}
            emailValidation={this.state.emailValidation}
          />
        );
      default:
        return null;
    }
  }

  render() {
    console.log('SignUpContainer', this.state);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ProgressBar
          style={{
            shadowColor: 'black',
            shadowOffset: { width: 5, height: 2 },
            shadowOpacity: 0.6,
            elevation: 4
          }}
          color={Colors.secondary_medium}
          borderRadius={0}
          width={null}
          height={5}
          borderWidth={0}
          progress={this.state.step / 3}
        />
        <View style={{ flex: 1, backgroundColor: Colors.secondary_container_background }}>
          {this.renderPageByIndex()}
        </View>
        {this.state.loading &&
          <View style={styles.loadingStyle}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
      </View>
    );
  }
}

const styles = {
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

export default connect(null, actions)(SignUpContainer);
