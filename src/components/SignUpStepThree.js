import React, { Component } from 'react';
import { View, Text } from 'react-native';
import validate from 'validate.js';

import Colors from '../constants/Color';
import { Button, UserInputValidation } from './common';

const constraints = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: { is: 6 },
  }
};

class SignUpStepThree extends Component {
  state = {
    email: null,
    password: null,
    password2: null,
    emailValidation: null,
    passwordValidation: null,
    password2Validation: null
  };

	componentWillMount() {
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onPassword2Changed = this.onPassword2Changed.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.setState({email:this.props.email,
                  emailValidation:this.props.emailValidation})
	}

  onEmailChanged(email) {
    validate.async({ email }, { email: constraints.email })
      .then(() => { this.setState({ email, emailValidation: true }); })
      .catch(() => { this.setState({ email, emailValidation: false }); });
  }

  onPasswordChanged(password) {
    validate.async({ password }, { password: constraints.password })
      .then(() => { this.setState({ password, passwordValidation: true }); })
      .catch(() => { this.setState({ password, passwordValidation: false }); });
  }

  onPassword2Changed(password2) {
    if (password2 === this.state.password && this.state.passwordValidation) {
      this.setState({ password2, password2Validation: true });
    } else {
      this.setState({ password2, password2Validation: false });
    }
  }

  validateForm() {
    console.log(this.state);
    if (this.state.emailValidation
      && this.state.passwordValidation
      && this.state.password2Validation
    ) {
      this.props.finishSignUp(this.state);
    }
  }

	render() {
    const isComplete = this.state.emailValidation && this.state.password2Validation && this.state.passwordValidation;
    const btnBgColor = isComplete ? Colors.button_background_login : '#BBB';
    const opacity = isComplete ? 1.0 : 0.3;   

		return (
			<View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, color:Colors.primar }}>
          Por fim, os dados da conta
        </Text>
        <UserInputValidation
          placeholder='Email'
          autoCapitalize='none'
          returnKeyType='go'
          secureTextEntry={false}
          autoCorrect={false}
          keyboardType='default'
          onChangeText={email => this.onEmailChanged(email)}
          validation={this.state.emailValidation}
          value={this.state.email}
          error={this.state.emailValidation == false ? 'Insira um e-mail válido' : null}
        />
        <UserInputValidation
          placeholder='Senha'
          autoCapitalize='none'
          returnKeyType='go'
          secureTextEntry
          autoCorrect={false}
          keyboardType='default'
          onChangeText={password => this.onPasswordChanged(password)}
          validation={this.state.passwordValidation}
          error={this.state.passwordValidation == false ? 'Insira uma senha com 6 caracteres' : null}
        />
        <UserInputValidation
          placeholder='Repita a senha'
          autoCapitalize='none'
          returnKeyType='done'
          secureTextEntry
          autoCorrect={false}
          keyboardType='default'
          onChangeText={password2 => this.onPassword2Changed(password2)}
          validation={this.state.password2Validation}
          error={this.state.password2Validation == false && this.state.passwordValidation? 'As senhas precisam ser iguais' : null}
        />
        <Button
          buttonColor={btnBgColor}
          opacity={opacity}
          disabled={!isComplete}
          textColor={Colors.button_text_primary}
          onPress={() => this.validateForm()}
        >
          Concluir cadastro
        </Button>
			</View>
		);
	}
}

export default SignUpStepThree;
