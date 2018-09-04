import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

import RewardListSection from '../components/RewardListSection';
import RewardReclaimSection from '../components/RewardReclaimSection';
import Colors from '../constants/Color';

const logoImage = require('../images/logo.png');

const RewardNavigator = StackNavigator(
{
  All: {
    screen: RewardListSection,
    navigationOptions: {
      tabBarLabel: 'All',
    }
  },
  Reclaim: {
    screen: RewardReclaimSection,
    navigationOptions: {
      tabBarLabel: 'Reclaim',
    }
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
  }
});

export default RewardNavigator;
