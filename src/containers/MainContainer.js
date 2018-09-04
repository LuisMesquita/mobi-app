import React, { Component } from 'react';
import { View, Image, StatusBar, Alert } from 'react-native';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import Permissions from 'react-native-permissions';
import OneSignal from 'react-native-onesignal';
import axios from 'axios';
import qs from 'qs';

import { setNotifications, logOut } from '../actions';
// import { CustomStatusBar } from '../components/common';


import MainTabNavigator from '../navigators/MainTabNavigator'
import TutorialContainer from '../containers/TutorialContainer';
import PointScreen from '../screens/PointScreen';
import Colors from '../constants/Color';
import Constants from '../constants/Constants';
import { onSignOut } from '../helpers/auth';

const MainNavigator = StackNavigator(
  {
    Tabs: {
      screen: MainTabNavigator,
    },
    PointsModal: {
      screen: PointScreen,
    },
    Tutorial: {
      screen: TutorialContainer
    }
  },
  {
    headerMode: 'none',
    mode: 'modal'
  }
);

class MainContainer extends Component {
  static navigationOptions = () => ({
    header: null
  });

  // state = {
  //   notifications: 0
  // };

  componentWillMount() {
    console.log('Main will mount')
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {   
    this.loadNotifications();
    this.askUsersPermission()
  }


  askUsersPermission() {
     Permissions.check('location').then(checkResponse => {
      if (checkResponse !== 'authorized') {
        Permissions.request('location').then(requestResponse => {
          if (requestResponse !== 'authorized') {
            Alert.alert(
              'Atenção',
              'Algumas funcionalidades do aplicativo não estarão' +
              'disponíveis sem a permissão da localização.',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            );
          }          
        });
      } else {      
      }      
    });    
  }  

  handleLogout() {
    this.props.logOut();
    onSignOut();        
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Loading' })
      ]
    }));         
  }

  handleNotifications() {
    if (!this.props.isLogged) {
      Alert.alert(
        'Cadastro necessário',
        'Entre na sua conta para receber notificações e como presentes das lojas',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Login', onPress: () => this.handleLogin() },
        ],
        { cancelable: false }
      );
      return;
    }

    this.props.navigation.navigate('Notifications');
  }

  handleLogin() {
    this.props.navigation.navigate('Start');   
  }

  loadNotifications() {
    if (!this.props.userId) {
      return;
    }

    console.log('loadNotifications called');
    axios.post(`${Constants.SERVER_URL}PostNotifyByUser?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.userId,
          page: 1
        })}`)
      .then(response => {
        const data = response.data;
        console.log('loadNotifications responded', data);

        if (data.HttpStatus === 200) {
          this.setState({ loading: false });

          this.props.setNotifications(data.Notifys);
        } else {
          this.setState({ loading: false });
          Alert.alert(
            'Ocorreu um erro!',
            data.Message,
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.log('loadNotifications error', error.response);
        this.checkError(error.response.data);
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

  handleWarning(data) {
    console.log('errorData', data);
    const mappedErrorCodes = [503, 505, 401, 403];
    if (mappedErrorCodes.includes(data.HttpStatus)) {
      this.openWarning(data)      
    }
    return;
  }

  openWarning(warning) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Warning', params: { warning }})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }


  render() {        
    return (
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        <StatusBar
           backgroundColor={Colors.status_bar_background}
           barStyle={Colors.statusBarStyle2}
        />
        <SafeAreaView style={styles.container} forceInset={{ top: 'never' }}>                
          <MainNavigator
            screenProps={{
              handleLogout: this.handleLogout.bind(this),
              handleLogin: this.handleLogin.bind(this),
              handleNotifications: this.handleNotifications.bind(this),
              handleWarning: this.handleWarning.bind(this)
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.tabbar_backgrund
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false
    };
  }

  return {
    isLogged: true,
    userId: state.loggedUser.Id,
    nofications: state.notifications
  };
};

export default connect(mapStateToProps, { setNotifications, logOut })(MainContainer);
