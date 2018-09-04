import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import Colors from '../constants/Color';

const giftAnimationJson = require('../animations/giftAnimation.json');

class ClosedGiftModal extends Component {

  componentDidMount() {
    this.animation.play();
    console.log('animation ->', this.animation)
  }
 
  render() {
    return (
      <View style={Styles.modalContentStyle}>
        <View
          style={Styles.topCircleStyle}
        />
        <View
          style={Styles.bottomCircleStyle}
        />
        <Text style={Styles.headerStyle}>
          Surpresa!
        </Text>
        <Text style={Styles.subheaderStyle}>
          A <Text style={Styles.subheaderEstablishmentStyle}>{this.props.giftEstablishmentName}</Text>
          {''} te mandou um presente:
        </Text>
        <TouchableOpacity
          onPress={() => this.props.toNextModal()}
          style={{ marginTop: 10 }}
        >
          <LottieView
            style={{height: 250, width: 300}}
            ref={animation => {
              this.animation = animation;
            }}
            source={giftAnimationJson}
          />
        </TouchableOpacity>
        <View style={Styles.psStyle}>
          <Text>Toque no presente para abrir</Text>
        </View>
      </View>
    );  
  }
}

const Styles = {
  topCircleStyle: {
    backgroundColor: Colors.modal_top_circle,
    width: 100,
    height: 100,
    position: 'absolute',
    borderRadius: 50,
    left: -50,
    top: -50,
  },
  bottomCircleStyle: {
    backgroundColor: Colors.modal_bottom_circle,
    width: 200,
    height: 200,
    position: 'absolute',
    borderRadius: 100,
    right: -100,
    bottom: -100
  },
  modalContentStyle: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center'
  },
  headerStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: 'transparent'
  },
  subheaderStyle: {
    marginTop: 5,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'transparent',
    width: '80%',
    textAlign: 'center'
  },
  subheaderEstablishmentStyle: {
    fontWeight: 'bold',
    color: Colors.primary
  },
  bigGiftImageStyle: {
    height: 150,
    width: 150,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  psStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  }
}

// Make the component available to other parts of the app
export default ClosedGiftModal;
