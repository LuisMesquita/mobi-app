import React, { Component } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Button, UserInput } from './common';
import RecoverLoginSection from './RecoverLoginSection';
import Colors from '../constants/Color';

class LoginForm extends Component {
  render() {
    const { onRecoverPress, onEmailChanged, onPasswordChanged } = this.props;

    return (
      <View style={styles.formContainerStyle}>
        <Text style={styles.headerTextStyle}>
          Coloque seu e-mail
        </Text>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.inputContainerStyle}
        >
          <UserInput
            placeholder='Email'
            autoCapitalize='none'
            returnKeyType='done'
            secureTextEntry={false}
            autoCorrect={false}
            keyboardType='email-address'
            onChangeText={email => onEmailChanged(email)}
          />          
          <Button
            buttonColor={Colors.button_background_login}
            textColor={Colors.button_text_primary}
            onPress={onRecoverPress}
          >
            Recuperar
          </Button>
        </KeyboardAvoidingView>  
        <RecoverLoginSection 
        goToLoginScreen={this.props.goToLoginScreen}/>      
      </View>
    );
  }
}

const styles = {
	formContainerStyle: {
		flex: 4,
    flexDirection: 'column',
		alignItems: 'center',
		alignContent: 'center'
	},
	headerTextStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.start_title_text,
    marginBottom: 30
  },
  inputContainerStyle: {
    flexDirection: 'column',
    alignSelf: 'stretch',
		alignItems: 'center',
		alignContent: 'center',
    marginLeft: 20,
    marginRight: 20
	},
};

export default LoginForm;
