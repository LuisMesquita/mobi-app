import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import LottieView from 'lottie-react-native';

import Colors from '../constants/Color';

const LogoImg = require('../images/brand.png');
const errorAnimationJson = require('../animations/errorAnimation.json');

class WarningModal extends Component {

  static navigationOptions = () => ({
    header: null
  });

  componentDidMount() {
    this.animation.play();
  }

  render() {
    console.log('WarningModal', this.props);
    const {
      warning
    } = this.props.navigation.state.params;

    const {
      containerStyle,
      logoStyle,
      titleStyle,
      messageStyle,
      animationStyle
    } = styles;

    return (
      <SafeAreaView style={containerStyle}>
        {/*<View style={topCircleStyle} />
        <View style={bottomCircleStyle} />*/}
        {/*<Image source={LogoImg} style={logoStyle} resizeMode='contain' />*/}

        <View style={{ height: 100, width: 100, alignSelf: 'center', marginBottom: 20 }}>
          <LottieView
            style={{ height: 100, width: 100 }}
            ref={animation => {
              this.animation = animation;
            }}
            source={errorAnimationJson}
          />
        </View>

        <Text style={titleStyle}>{warning.Title}</Text>
        <Text style={messageStyle}>{warning.Message}</Text>

      </SafeAreaView>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: Colors.container_background,
    flex: 1,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },
  logoStyle: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20
  },
  titleStyle: {
    fontSize: 26,
    textAlign: 'center',
    color: Colors.start_title_text,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: 'transparent'
  },
  messageStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.start_title_text
  },
  animationStyle: {

  }
};

export default WarningModal;
