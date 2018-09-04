import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import Svg, { Path } from 'react-native-svg';

import Colors from '../constants/Color';

const activeTintColor = Colors.tabbar_icon_color;
const inactiveTintColor = '#B3B3B3';

class CustomTabBarBottom extends Component {
  openCamera() {
    if (!this.props.isLogged) {
      Alert.alert(
        'Cadastro necessário',
        'Entre na sua conta para poder receber pontos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Login', onPress: () => this.props.screenProps.handleLogin() },
        ],
        { cancelable: false }
      );
      return;
    }

    const modalScreen = 'PointsModal';
    this.props.navigation.navigate(modalScreen);
  }

  renderItem(route, index) {
    const { navigation, jumpToIndex } = this.props;
    const isModal = index === 2;

    const focused = index === navigation.state.index;
    const color = focused || isModal ? activeTintColor : inactiveTintColor;
    
    return (
      <TouchableWithoutFeedback
        key={route.key}
        onPress={() => {
          return isModal ? this.openCamera() : jumpToIndex(index);
        }}
      >
        <View style={styles.tabItemStyle}>
          {this.props.renderIcon({ focused, route, tintColor: color })}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getSvgScale() {
    const deviceWidth = Dimensions.get('window').width;
    const svgWidth = 377;
    const scaleReadjust = 1.0027422303;

    const scale = (deviceWidth / svgWidth) * scaleReadjust;
    return scale;
  }

  render() {
    const { navigation } = this.props;
    const { routes } = navigation.state;

    return (
      <View
        style={styles.tabBarStyle}
        forceInset={{ bottom: 'always', top: 'never' }}
      >   
        <View 
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 15,

            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -10
          }}
        />    
        <Svg
          height='200'
          width='100vw'
          style={styles.svgLayer}
        >
          <Path
            d="M0.5,11.5 L0.5,60.5 L376.5,60.5 L376.5,11.5 L221.258,11.5 C216.981722,11.5 212.875405,10.1434488 209.624907,7.59980001 C203.778154,3.02553403 196.582028,0.5 189,0.5 C181.417106,0.5 174.220945,3.02545687 168.374138,7.59976541 C165.123432,10.1435761 161.018036,11.5 156.742,11.5 L0.5,11.5 Z"
            fill='rgba(0, 0, 0, .3)'
            scale={this.getSvgScale()}
            y='2'
          />
          <Path
            d="M0.5,11.5 L0.5,60.5 L376.5,60.5 L376.5,11.5 L221.258,11.5 C216.981722,11.5 212.875405,10.1434488 209.624907,7.59980001 C203.778154,3.02553403 196.582028,0.5 189,0.5 C181.417106,0.5 174.220945,3.02545687 168.374138,7.59976541 C165.123432,10.1435761 161.018036,11.5 156.742,11.5 L0.5,11.5 Z"
            fill='white'
            stroke='none'
            scale={this.getSvgScale()}
            y='3'
          />
        </Svg>
        { routes && routes.map(this.renderItem.bind(this))}
      </View>
    );
  }
}

const styles = {
  svgLayer: {
    position: 'absolute',   
    top: 0,
    bottom: 0,
    left: 0,
    right: -10,
  },
  tabBarStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
    height: 61,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    
    paddingBottom: 12,
  },
  tabItemStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false
    };
  }

  return {
    isLogged: true
  }
};

export default connect(mapStateToProps)(CustomTabBarBottom);
