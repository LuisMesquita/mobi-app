import React, { Component } from 'react';
import {
  View,
  Text,
  NetInfo,
  Alert,
  ActivityIndicator, 
  TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import qs from 'qs';
import Mailer from 'react-native-mail';

import { logInWithFacebook ,checkIfLogged } from '../actions';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

import { Button, CustomStatusBar } from '../components/common';
import Constants from '../constants/Constants';
import Logo from '../components/Logo';
import Colors from '../constants/Color';
import FacebookButton from '../components/FacebookButton';

const DeviceInfo = require('react-native-device-info');

let didFocusSubscription = null;

class StartContainer extends Component {
  static navigationOptions = () => ({
    header: null
  });

  state = {    
    networkAvailable: false,    
    loading: false,
    loadedFacebook: false,
  };

  componentDidMount() {     
  console.log('componentDidMount')     
    // // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('StartScreen');
          }
        );
  }

  componentWillUnmount() {
    console.log('willUnmount', this.state);
    didFocusSubscription.remove();
  }

  finishFacebookLogin(params) {
    const facebookLoginData = qs.stringify(params);
    console.log("finishFacebookLogin")
    this.requestLoginViaFacebook(facebookLoginData);
  }

  requestLoginViaFacebook(facebookData) {        
    this.props.logInWithFacebook(facebookData, (error) => {                  
      if (error) {
        console.log('fbError', error)
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'log_in'
        );                    
        return;
      }      

      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
        'log_in'
      );      
    })    

    this.setState({ loadedFacebook: true })


    //Solução temporária, para fazer com o usuário tente o login com o facebook novament
    if (!this.props.isLogged) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar conexão com o Facebook. Tente novamente.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    }
  }

  handleFacebookLogin() {
    // Log fb login press on analytics
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'fb_login'
    );
    
    const instance = this;

    LoginManager.logInWithReadPermissions(
      ['email', 'public_profile', 'user_birthday', 'user_hometown', 'user_location']
    ).then(
      function (result) {
        if (result.isCancelled) {
          // Log fb login cancel on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_CANCELED,
            'fb_login'
          );

          instance.setState({ loading: false });
        } else {          
          
          const responseInfoCallback = (error, cbResult) => {
            if (error) {
              // Log fb login failure on analytics
              MobiAnalytics.shared().trackEvent(
                ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
                'fb_login'
              );

              Alert.alert(
                'Erro',
                'Ocorreu um erro ao tentar conexão com o Facebook. Tente novamente.',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
              );
            } else {
              this.facebookData.facebookId = cbResult.id;
              this.facebookData.name = cbResult.name;
              this.facebookData.gender = cbResult.gender;
              this.facebookData.locale = cbResult.locale;
              this.facebookData.email = cbResult.email;
              this.facebookData.birthday = '';
              this.facebookData.location = '';
              this.facebookData.hometown = '';                 
              return instance.finishFacebookLogin(this.facebookData);              
            }
          };

          AccessToken.getCurrentAccessToken().then(
            (data) => {              
              this.facebookData = {};
              this.facebookData.facebookAccessToken = data.accessToken;
              this.facebookData.facebookAccessExpires = data.expirationTime.toFixed(0);

              const infoRequest = new GraphRequest(
                '/me',
                {
                  parameters: {
                    fields: {
                      string: 'email,name,gender,locale' // what you want to get
                    },
                    access_token: {
                      string: data.accessToken
                    }
                  }
                },
                responseInfoCallback
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          );
        }
      },
      (error) => {
        // Log fb login failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'fb_login'
        );   
      }
    );
  }

  onContactPress() {
    const email = Constants.SUPPORT_EMAIL;

    const osVersion = `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`;
    const deviceModel = DeviceInfo.getModel();
    const appVersion = DeviceInfo.getVersion();

    const tags = `[${osVersion}] [${deviceModel}] [${appVersion}]`;
    const subject = `${tags} Suporte ${DeviceInfo.getApplicationName()}`;
    // console.log(subject);

    Mailer.mail({
      subject,
      recipients: [email],
      isHTML: true,
    }, (error, event) => {
      if (error === 'not_available') {
        Alert.alert(
          'Suporte',
          `Por favor, envie um email para ${email}`,
          [
            { text: 'Ok' },
          ],
          { cancelable: true }
        );
      }
    });
  }

  openHome() {        
    console.log('openHome')
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' })
      ]
    }));         
  }

  renderStartContent() {    
    if(this.state.loadedFacebook){
          this.openHome();
    }

    const { navigation } = this.props;
    const {
      startContainerStyle,
      formContainerStyle,
      titleTextStyle,
      singupContainerStyle,
      helpLinkTextStyle
    } = styles;    

    return (
      <View style={startContainerStyle}>
        <CustomStatusBar
          backgroundColor={Colors.alt_status_bar_background} barStyle={Colors.statusBarStyle1}
        />
        <Logo />
        <View style={formContainerStyle}>
          <Text style={titleTextStyle}>
            Seja bem vindo!
          </Text>
          <View style={singupContainerStyle}>
            <FacebookButton onPress={this.handleFacebookLogin.bind(this)} />
            <Button
              buttonColor={'#fff'}
              textColor={Colors.button_text_secundary}
              onPress={() => {                
                navigation.navigate('SignUp');                
              }}
              style={{ marginTop: 10 }}
            >
              Quero me cadastrar
            </Button>
          </View>
          <Button
            buttonColor={'#fff'}
            textColor={Colors.button_text_secundary}
            onPress={() => {              
              navigation.navigate('Login');              
            }}
            style={{ marginTop: 10 }}
          >
            Entrar na minha conta
          </Button>
          <TouchableOpacity
            style={{                            
              marginVertical: 20,
            }}
            onPress={this.openHome.bind(this)}
          >
            <Text style={helpLinkTextStyle}>
              {'Entrar sem fazer login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginBottom: 30,
              bottom: 0,
              position: 'absolute'
            }}
            onPress={this.onContactPress}
          >
            <Text style={helpLinkTextStyle}>
              {'Dificuldades para\nacessar o app?'}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.loading &&
          <View style={styles.loadingStyle}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }        
      </View>
    );
  }

  render() {
    return this.renderStartContent();
  }
}

const styles = {
  startContainerStyle: {
    flex: 1,
    alignContent: 'space-between',
    backgroundColor: Colors.container_background
  },
  formContainerStyle: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  titleTextStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.start_title_text,
    marginBottom: 20
  },
  singupContainerStyle: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10
  },
  helpLinkTextStyle: {
    color: Colors.text_link,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
};


const mapStateToProps = (state) => {
  return {
    isLogged: state.loggedUser,
  };
};

export default connect(mapStateToProps, { logInWithFacebook })(StartContainer);
