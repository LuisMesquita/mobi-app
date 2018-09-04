import React, { Component } from 'react';
import { WebView, View } from 'react-native';

import Constants from '../constants/Constants';
import { MobiAnalytics } from '../helpers/Analytics';

class ProfileHelpSection extends Component {
  componentDidMount() {
    MobiAnalytics.shared().trackScreen('TermsOfUse');
  }
  
  render() {
    return (  
      <View style={{flex: 1, marginTop: -81}}>
        <WebView
          source={{ uri: Constants.FAQ_URL }}          
        />    
      </View>  
    );
  }
}

export default ProfileHelpSection;
