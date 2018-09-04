import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

import StoreListSection from '../components/StoreListSection';
import StoreSingleSection from '../components/StoreSingleSection';
import StoreSingleMenuItemSection from '../components/StoreSingleMenuItemSection';
import StoreSurveySection from '../components/StoreSurveySection';

import Colors from '../constants/Color';

const logoImage = require('../images/logo.png');

const StoreNavigator = StackNavigator(
{
  All: {
    screen: StoreListSection,
  },
  Single: {
    screen: StoreSingleSection,
  },
  Menu: {
    screen: StoreSingleMenuItemSection,
  },
  Survey: {
    screen: StoreSurveySection,
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
      elevation: 0,      
    },       
    headerTintColor: 'white'
  }
});

export default StoreNavigator;
