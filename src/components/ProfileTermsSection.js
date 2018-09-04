import React, { Component } from 'react';
import { WebView } from 'react-native';

import Constants from '../constants/Constants';
import { MobiAnalytics } from '../helpers/Analytics';

class ProfileTermsSection extends Component {
  componentDidMount() {
    MobiAnalytics.shared().trackScreen('TermsOfUse');
  }

  render() {
    return (
      <WebView
        source={{ uri: Constants.TERMS_URL }}
        style={{ paddingBottom: 61 }}
      />
    );
  }
}

export default ProfileTermsSection;
