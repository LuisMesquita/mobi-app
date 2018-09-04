import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';
import { checkIfLogged, setRootNavigation, logInWithFacebook, logInWithEmail } from '../actions';
import { CustomStatusBar } from '../components/common';

import Colors from '../constants/Color';

import {  
  onSignOut,  
  USER_EMAIL_PWD_KEY,
} from '../helpers/auth';

class LoadingContainer extends Component {
  
  componentDidMount() { 
    console.log('loading mount')      
    this.props.setRootNavigation(this.props.navigation);
    this.props.checkIfLogged((data) => {              
      if(data != null) {   
        console.log("data", data)       
        if (data.type === USER_EMAIL_PWD_KEY) {          
          const email = data.val.substring(0, data.val.indexOf('/'));
          const password = data.val.substring(data.val.indexOf('/') + 1);
          this.requestLoginViaEmailAndPassword(email, password);
        } else {                    
          this.requestLoginViaFacebook(data.val);
        }      
      } else if (data == null) { this.goTo('Start') }
    })  
  }

  goTo(routeName) {
    SplashScreen.hide()
    console.log('goTo', routeName)
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName })
      ]
    })); 
  }

  requestLoginViaFacebook(facebookData) {       
    this.props.logInWithFacebook(facebookData, (error) => {                  
      if (error) {
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'log_in'
        );    
        // this.goToStart()           
        return;
      }

      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
        'log_in'
      );

      this.goTo('Main');      
    })
  }

  requestLoginViaEmailAndPassword(email, password) {
    this.props.logInWithEmail(email, password, (error) => {
      this.setState({ loading: false });

      if (error) {
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'log_in'
        );     
        // this.goToStart()       
        return;        
      }

      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
        'log_in'
      );
      
      this.goTo('Main');      
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.container_background }}>
        <CustomStatusBar
          backgroundColor={Colors.alt_status_bar_background} barStyle={Colors.statusBarStyle2}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.authBackground
  }
};

export default connect(null, { setRootNavigation, checkIfLogged, logInWithFacebook, logInWithEmail })(LoadingContainer);
