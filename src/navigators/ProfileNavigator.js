import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

import ProfileSection from '../components/ProfileSection';
import ProfileEditSection from '../components/ProfileEditSection';
import ProfileStatementSection from '../components/ProfileStatementSection';
import ProfileHelpSection from '../components/ProfileHelpSection';
import ProfileAboutSection from '../components/ProfileAboutSection';
import ProfileTermsSection from '../components/ProfileTermsSection';
import Colors from '../constants/Color';

const logoImage = require('../images/logo.png');

const ProfileNavigator = StackNavigator(
{
  Profile: {
    screen: ProfileSection,
  },
  Edit: {
    screen: ProfileEditSection,
  },
  Statement: {
    screen: ProfileStatementSection,
  },
  Help: {
    screen: ProfileHelpSection,
  },
  About: {
    screen: ProfileAboutSection,
  },
  Terms: {
    screen: ProfileTermsSection,
  }
}, {
  headerMode: 'screen',
	navigationOptions: {
	headerTitle: (
      <Image
        source={logoImage}
        style={{ width: 150, height: '65%', resizeMode: 'contain' }}
      />
    ),
    headerTitleStyle: {                     
      fontSize: 20,
      fontWeight: 'bold',
    },          
    headerStyle: {
      backgroundColor: Colors.header_background,            
    },
    headerTintColor: 'white'
  }});

export default ProfileNavigator;
