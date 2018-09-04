// Import libraries to help create a component
import React, { Component } from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';

const facebookIcon = require('../images/facebook_icon.jpg');

// Make a component
class FacebookButton extends Component {
    render() {
    const { baseButtonStyle, baseTextStyle } = styles;

    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={baseButtonStyle}
      >
        <Image
          source={facebookIcon}
          style={{
            width: 24,
            height: 24,
            borderRadius: 2,
            marginLeft: 10,
            position: 'absolute',
            left: 0,
          }}
        />
        <Text style={baseTextStyle}>Entrar com Facebook</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  baseButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#3b5998',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#3b5998',
    marginTop: 10
  },
  baseTextStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

// Make the component available to other parts of the app
export default FacebookButton;
