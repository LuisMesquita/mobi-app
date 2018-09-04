import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import validate from 'validate.js';

import Colors from '../constants/Color';
import { Button, UserInputValidation } from './common';

const constraints = {
  name: {
    presence: { allowEmpty: false }
  },
  surname: {
    presence: { allowEmpty: false }
  }
};

class StoreSurveyStepOne extends Component {
  state = {
    name: null,
    surname: null,
    nameValidation: null,
    surnameValidation: null
  };

	componentWillMount() {
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onSurnameChanged = this.onSurnameChanged.bind(this);
    this.validateForm = this.validateForm.bind(this);
    
    this.setState({name:this.props.name,
                   surname:this.props.surname,
                   nameValidation:this.props.nameValidation,
                   surnameValidation:this.props.surnameValidation })
    console.log('State', this.state)
	}

  onNameChanged(name) {
    validate.async({ name }, { name: constraints.name })
      .then(() => { this.setState({ name, nameValidation: true }); })
      .catch(() => { this.setState({ name, nameValidation: false }); });    
  }

  onSurnameChanged(surname) {
    validate.async({ surname }, { surname: constraints.surname })
      .then(() => { this.setState({ surname, surnameValidation: true }); })
      .catch(() => { this.setState({ surname, surnameValidation: false }); });    
  }

  validateForm() {
    validate.async({ name: this.state.name, surname: this.state.surname }, constraints)
      .then(() => {
        this.props.toNextStep(this.state);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

	render() {
    console.log('SignUpStepOne', this.state);
    const isComplete = this.state.nameValidation && this.state.surnameValidation;
    const btnBgColor = isComplete ? Colors.button_background_login : '#BBB';
    const opacity = isComplete ? 1.0 : 0.3;   


		return (
			<View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, color:Colors.primary}}>
          Primeiro, qual seu nome?
        </Text>
        <KeyboardAvoidingView
          behavior='padding'
        >
          <UserInputValidation
            placeholder='Nome'
            autoCapitalize='words'
            returnKeyType='done'
            autoCorrect={false}
            onChangeText={name => this.onNameChanged(name)}
            validation={this.state.nameValidation} 
            error={this.state.nameValidation == false ? 'Insira um nome' : null}
            value={this.state.name}           
          />
          <UserInputValidation
            placeholder='Sobrenome'
            autoCapitalize='words'
            returnKeyType='done'
            autoCorrect={false}
            onChangeText={surname => this.onSurnameChanged(surname)}
            validation={this.state.surnameValidation}
            error={this.state.surnameValidation == false ? 'Insira um sobrenome' : null}
            borderColor={Colors.primary}
            value={this.state.surname}
          />
        </KeyboardAvoidingView>
        <Button
          buttonColor={btnBgColor}
          opacity={opacity}
          disabled={!isComplete}
          textColor={Colors.button_text_primary}
          onPress={() => this.validateForm()}
        >
          Próximo
        </Button>
			</View>
		);
	}
}

export default StoreSurveyStepOne;
