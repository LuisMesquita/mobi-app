import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Color';

class LoginSignupSection extends Component {
	render() {
    const {
      sectionContainerStyle,
      forgotPasswordStyle,
      signupContainerStyle,
      signupNormalStyle,
      signupUnderlineStyle
    } = styles;

		return (
			<View style={sectionContainerStyle}>
        <TouchableOpacity onPress={() => this.props.goToRecoverScreen()}>
          <Text style={forgotPasswordStyle}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <View style={signupContainerStyle}>
  				<TouchableOpacity onPress={() => this.props.goToSignUpScreen()} style={signupContainerStyle}>	
            <Text style={signupNormalStyle}>Novo usuário?</Text>          
						<Text style={signupUnderlineStyle}>Crie sua conta</Text>
					</TouchableOpacity>
        </View>
			</View>
		);
	}
}

const styles = {
	sectionContainerStyle: {
		marginTop: 10,
    flex: 1,
    marginBottom: 30,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
  forgotPasswordStyle: {
    color: Colors.text_link,
		backgroundColor: 'transparent',
    textDecorationLine: 'underline',
    alignSelf: 'center'
  },
  signupContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signupNormalStyle: {
    color: Colors.text_link,
		backgroundColor: 'transparent'
  },
  signupUnderlineStyle: {
    color: Colors.text_link,
    marginLeft: 5,
		backgroundColor: 'transparent',
    textDecorationLine: 'underline'
  }
};

export default LoginSignupSection;
