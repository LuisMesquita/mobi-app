import React, { Component } from 'react';
import { ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

import { Section } from './common';
import Constants from '../constants/Constants';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const facebookImage = require('../images/face.png');
const instagramImage = require('../images/insta.png');
const twitterImage = require('../images/twitter.png');

class HomeSocialSection extends Component {

  constructor() {
    super();

    this.openSocialURL = this.openSocialURL.bind(this);
  }

  logSocialTapOnAnalytics(socialMedia) {
    // Log social tap on analytics
    const eventLabel = `open_${socialMedia}`;
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      eventLabel
    );
  }

  openSocialURL(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  render() {
    const {
      containerStyle,
      thumbnailStyle,
      scrollViewStyle
    } = styles;    
    return (
      <Section
        header='Fique por dentro'
        subHeader='Siga nossas redes sociais e fique por dentro'
        style={{ paddingBottom: 61 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={scrollViewStyle}
        >
          {Constants.facebook &&
          <TouchableOpacity
            style={containerStyle}
            onPress={() => {
              this.logSocialTapOnAnalytics('facebook');
              this.openSocialURL(Constants.facebook);
            }}
          >
            <Image
            style={thumbnailStyle}
            source={facebookImage}
            />
          </TouchableOpacity>}

          {Constants.instagram &&
          <TouchableOpacity
            style={containerStyle}
            onPress={() => {
              this.logSocialTapOnAnalytics('instagram');
              this.openSocialURL(Constants.instagram);
            }}
          >
            <Image
            style={thumbnailStyle}
            source={instagramImage}
            />
          </TouchableOpacity>}
          
          {Constants.twitter &&
          <TouchableOpacity
            style={containerStyle}
            onPress={() => {
              this.logSocialTapOnAnalytics('twitter');
              this.openSocialURL(Constants.twitter);
            }}
          >
            <Image
            style={thumbnailStyle}
            source={twitterImage}
            />
          </TouchableOpacity>}

        </ScrollView>
      </Section>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  thumbnailStyle: {
    height: 80,
    width: 80,
    borderRadius: 5
  },
  scrollViewStyle: {
    paddingHorizontal: 5
  }
};

export default HomeSocialSection;
