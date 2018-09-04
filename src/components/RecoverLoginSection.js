import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Color';

class RecoverLoginSection extends Component {
	render() {
    const {
      sectionContainerStyle,
      forgotPasswordStyle,
      containerStyle,
      normalStyle,
      underlineStyle
    } = styles;

		return (
			<View style={sectionContainerStyle}>        
        <View style={containerStyle}>
					<TouchableOpacity  onPress={() => this.props.goToLoginScreen()} style={containerStyle}>
            <Text style={normalStyle}>Lembrou a senha?</Text>
  					<Text style={underlineStyle}>Entre em sua conta</Text>
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
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  normalStyle: {
    color: Colors.text_link,
		backgroundColor: 'transparent'
  },
  underlineStyle: {
    color: Colors.text_link,
    marginLeft: 5,
		backgroundColor: 'transparent',
    textDecorationLine: 'underline'
  }
};

export default RecoverLoginSection;
