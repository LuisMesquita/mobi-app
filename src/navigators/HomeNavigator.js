import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeContainer from '../containers/HomeContainer';
import StoreSingleSection from '../components/StoreSingleSection';
import StoreSingleMenuItemSection from '../components/StoreSingleMenuItemSection';
import StoreSurveySection from '../components/StoreSurveySection';
import ProfileStatementSection from '../components/ProfileStatementSection';
import ProfileHelpSection from '../components/ProfileHelpSection';

import Colors from '../constants/Color';

const logoImage = require('../images/logo.png');

const HomeNavigator = StackNavigator(
{
  Home: {
    screen: HomeContainer,
  },
  Single: {
    screen: StoreSingleSection,
  },
  Menu: {
    screen: StoreSingleMenuItemSection,
  },
  Survey: {
    screen: StoreSurveySection,
  },
  Statement: {
    screen: ProfileStatementSection,
  }, 
  Help: {
    screen: ProfileHelpSection,
  },
}, {
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
      elevation: 0,      
    },       
    headerTintColor: 'white'
  }
});

export default HomeNavigator;
