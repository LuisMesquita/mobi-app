import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Mailer from 'react-native-mail';

import * as actions from '../actions';
import { PointsView, RoundImage, TextLink } from './common';
import Colors from '../constants/Color';
import Constants from '../constants/Constants';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

import NotificationBadge from './NotificationBadge';

var DeviceInfo = require('react-native-device-info');
const editImage = require('../images/ic_edit.png');
const helpImage = require('../images/ic_help.png');
const arrowRightImage = require('../images/arrow_right.png');
const userPlaceholder = require('../images/user-placeholder.png');

let didFocusSubscription = null;

class ProfileSection extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);

    return {
      headerLeft: <View />,
      headerRight: <NotificationBadge navigation={navigation} />
    };
  };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('Profile');
          }
        );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleNotifications: this.handleNotifications
    });
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  onLogoutPress() {
    // Log logout press on analytics
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'log_out'
    );

    Alert.alert(
      'Fazer logout',
      'Você deseja realmente fazer logout?',
      [
        { text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            // Log logout cancel on analytics
            MobiAnalytics.shared().trackEvent(
              ANALYTICS_EVENTS_TYPES.ACTION_CANCELED,
              'log_out'
            );
          }
        },
        { text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Log logout success on analytics
            MobiAnalytics.shared().trackEvent(
              ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
              'log_out'
            );

            this.props.screenProps.handleLogout();
          }
        },
      ]
    );
  }

  onContactPress() {
    const email = Constants.SUPPORT_EMAIL;

    const osVersion = `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`;
    const deviceModel = DeviceInfo.getModel();
    const appVersion = DeviceInfo.getVersion();

    const tags = `[${osVersion}] [${deviceModel}] [${appVersion}]`;
    const subject = `${tags} Suporte ${DeviceInfo.getApplicationName()}`;

    const body =
    `<b>Usuário:</b> ${this.props.name}
    <br>
    <b>Email:</b> ${this.props.email}
    <br>
    <b>CPF:</b> ${this.props.CPF}
    <br>
    <br>
    -- Por favor, descreva abaixo sua situação.--
    <br>`;

    Mailer.mail({
      subject,
      body,
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

  handleNotifications = () => {
    this.props.screenProps.handleNotifications();
  }

  onLoginPress() {
    this.props.screenProps.handleLogin();
  }

  renderProfileInfo() {
    const {
      sectionContainerStyle,
      profileInfoContainer,
      personalInfoStyle,
      profileHeaderStyle,
      profileSubHeaderStyle
    } = styles;
    
    if (!this.props.isLogged) {
      const textWidth = (Dimensions.get('window').width) - 64 - 80;

      return (
        <View style={sectionContainerStyle}>
          <View style={profileInfoContainer}>
            <RoundImage
              source={userPlaceholder}
              size={64}
            />
            <TouchableOpacity onPress={() => this.onLoginPress()}>
              <Text
                numberOfLines={2}
                style={{
                  // textAlign: 'center',
                  fontSize: 20,
                  marginLeft: 10,
                  width: textWidth,
                  textDecorationLine: 'underline',
                  color: 'gray'
                }}
              >
                Faça login para visualizar seu perfil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View>
        <View style={sectionContainerStyle}>
          <View style={profileInfoContainer}>
            <RoundImage
              source={{ uri: this.props.imageUrl }}
              size={64}
            />
            <View style={personalInfoStyle}>
              <Text numberOfLines={1} style={profileHeaderStyle}>{this.props.name}</Text>
              <Text style={profileSubHeaderStyle}>{this.props.CPF}</Text>
              <Text style={profileSubHeaderStyle}>{this.props.email}</Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Edit')}>
              <View style={{ flex: 1 }}>
                <Image source={editImage} style={{ width: 20, height: 20, tintColor: 'gray' }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Statement')}>
          <View style={sectionContainerStyle}>
            <PointsView
              points={this.props.points}
              backgroundColor={Colors.points_view_background}
              borderColor={Colors.points_view_text}
              textColor='#fff'
            />
              
              <View
                style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: 'gray', fontSize: 18 }}>
                  Ver extrato
                </Text>
                <Image
                  style={{ width: 18, height: 18, tintColor: 'gray' }}
                  source={arrowRightImage}
                />
              </View>          
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      sectionColumnContainerStyle,
    } = styles;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        {this.renderProfileInfo()}
        <View style={sectionColumnContainerStyle}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Help')}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderRadius: 5,
              backgroundColor: Colors.button_background_primary
            }}
          >
            <Image
              source={helpImage}
              style={{
                width: 24,
                height: 24,
                borderRadius: 2,
                marginLeft: 10,
                position: 'absolute',
                tintColor: 'white',
                left: 0,
              }}
            />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: 24,
                paddingTop: 10,
                paddingBottom: 10
              }}
            >
              Precisa de ajuda?
            </Text>
          </TouchableOpacity>

          <TextLink 
            title='Entre em contato'
            onPress={this.onContactPress.bind(this)}
            containerStyle={{ marginBottom: 0, marginTop: 10 }}
          />
        </View>

        <View style={sectionColumnContainerStyle}>
          <TextLink
            title='Sobre o app'
            onPress={() => this.props.navigation.navigate('About')}
          />
          <TextLink
            title='Termos de Uso'
            onPress={() => this.props.navigation.navigate('Terms')}
          />
          {this.props.isLogged &&
             <TextLink
              title='Logout'
              onPress={() => this.onLogoutPress()}
              containerStyle={{ marginBottom: 0 }}
            />
          }
        </View>
      </ScrollView>
    );
  }
}
const styles = {
  sectionContainerStyle: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  sectionColumnContainerStyle: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  personalInfoStyle: {
    marginLeft: 20,
    flex: 1
  },
  profileHeaderStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text_title
  },
  profileSubHeaderStyle: {
    fontSize: 14,
    color: '#bbb'
  },
  socialImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 5
  },
  socialConnectStyle: {
    backgroundColor: Colors.button_background_primary,
    borderRadius: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 24
  },
  socialConnectedStyle: {
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 24
  },
  socialTextStyle: {
    color: 'white',
  },
  socialConnectedTextStyle: {
    color: Colors.button_background_primary,
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false
    };
  }
  console.log('estado',state)
  return {
    isLogged: true,
    id: state.loggedUser.Id,
    name: state.loggedUser.Name,
    CPF: state.loggedUser.CPF,
    email: state.loggedUser.Email,
    imageUrl: state.loggedUser.Photo,
    points: (state.currentPoints ? state.currentPoints : 0),
  };
};

export default connect(mapStateToProps, actions)(ProfileSection);
