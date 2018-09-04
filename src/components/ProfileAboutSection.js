import React, { Component } from 'react';
import { WebView } from 'react-native';

import Constants from '../constants/Constants';
import { MobiAnalytics } from '../helpers/Analytics';

class ProfileStatementSection extends Component {
  componentDidMount() {
    MobiAnalytics.shared().trackScreen('AboutApp');
  }

  render() {
    return (
      <WebView
        source={{ uri: Constants.ABOUT_URL }}
      />
    );
  }
}

export default ProfileStatementSection;
