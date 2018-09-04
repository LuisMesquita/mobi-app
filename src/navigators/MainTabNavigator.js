import React from 'react';
import { Image, View } from 'react-native';
import { TabNavigator } from 'react-navigation';

import { mapNavigationStateParamsToProps } from '../helpers/Utils';
import CustomTabBarBottom from '../components/CustomTabBarBottom';
import Colors from '../constants/Color';

import HomeScreen from '../screens/HomeScreen';
import StoreScreen from '../screens/StoreScreen';
import RewardScreen from '../screens/RewardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const homeImage = require('../images/home_icon.png');
const storeImage = require('../images/store_icon.png');
const pointImage = require('../images/plus_icon.png');
const rewardImage = require('../images/reward_icon.png');
const profileImage = require('../images/profile_icon.png');


const MainTabNavigator = TabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={homeImage}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  Store: {
    screen: StoreScreen,
    navigationOptions: {
      tabBarLabel: 'Store',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={storeImage}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  Point: {
    screen: View,
    // screen: PointScreen,
    navigationOptions: {
      tabBarLabel: 'Point',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={pointImage}
          style={[styles.icon, { tintColor }]}
        />
      ),
    }
  },
  Reward: {
    screen: mapNavigationStateParamsToProps(RewardScreen),
    navigationOptions: {
      tabBarLabel: 'Reward',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={rewardImage}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={profileImage}
          style={[styles.icon, { tintColor }]}
        />
      )
    },
  },
}, {
  tabBarComponent: CustomTabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  headerMode: 'none',
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: Colors.tabbar_icon_color,
    showLabel: false,
  },
  lazy: true
});

const styles = {
  icon: {
    width: 26,
    height: 26
  }
};

export default MainTabNavigator