import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import ModalDropdown from 'react-native-modal-dropdown';
import validate from 'validate.js';

import Colors from '../constants/Color';
import { Button } from './common';
import { isValidCPF, isValidDate } from '../helpers/Validators';

import _ from "lodash"

const validationOk = require('../images/ic_done.png');
const arrowImage = require('../images/ic_arrow_down.png');
const validationFalse = require('../images/excluir.png');

validate.validators.date_custom = function (value) {
  return new validate.Promise((resolve) => {
    setTimeout(() => {
      if ((value && isValidDate(value)) || value === null) resolve();
      else resolve('^Data inválida.');
    }, 100);
  });
};

validate.validators.cpf = function (value) {
  return new validate.Promise((resolve) => {
    setTimeout(() => {
      if ((value && isValidCPF(value.replace(/\./g, '').replace(/-/g, '')))|| value === '') resolve();
      else resolve('^CPF inválido.');
    }, 100);
  });
};


const constraints = {
  birth: {    
    length: { is: 10 },
    date_custom: true, 
  },
  gender: {    
    presence: { allowEmpty: false }
  },
  cpf: {    
    cpf: true,    
  }
};

class StoreSurveyStepTwo extends Component {
  state = {
    birth: null,
    gender: null,
    cpf: null,
    birthValidation: null,
    genderValidation: null,
    cpfValidation: null,
  };

	componentWillMount() {
    this.onBirthChanged = this.onBirthChanged.bind(this);    
    this.onBirthChanged = _.debounce(this.onBirthChanged, 10)
    this.onCPFChanged = this.onCPFChanged.bind(this);
    this.onCPFChanged = _.debounce(this.onCPFChanged, 10)
    this.validateForm = this.validateForm.bind(this);

    this.setState({
      birth: this.props.birth,
      gender: this.props.gender,
      genderIndex: this.props.genderIndex,
      cpf: this.props.cpf,
      birthValidation: this.props.birthValidation,
      genderValidation: this.props.genderValidation,
      cpfValidation: this.props.cpfValidation
    });
	}

  onBirthChanged() {    
    const birth = this.state.birth
      validate.async({ birth }, { birth: constraints.birth })
        .then(() => { this.setState({ birthValidation: true }); })
        .catch(() => { this.setState({ birthValidation: false }); });    
  }

  onGenderPicked(index) {    
    if (index === '0') {      
      this.setState({ genderIndex: index, gender: 'female', genderValidation: true });
    } else if (index === '1') {      
      this.setState({ genderIndex: index, gender: 'male', genderValidation: true });
    } else if (index === '2') {      
      this.setState({ genderIndex: index, gender: '', genderValidation: true });
    }
  }

  onCPFChanged() {    
    const cpf = this.state.cpf    
    validate.async({ cpf }, { cpf: constraints.cpf })
      .then(() => { this.setState({ cpfValidation: true }); })
      .catch(() => { this.setState({ cpfValidation: false }); });
  }

  getGenderByIndex() {    
    if (this.state.genderIndex === '0') {
      console.log('le 1');
      return 'Feminino';      
    } else if (this.state.genderIndex === '1') {
      console.log('le 2');
      return 'Masculino';
    } else if (this.state.genderIndex === '2'){
      console.log('le 3');
      return 'Outro';
    } else {
      return 'Selecione o seu genero'
    }
  }

  validateForm() {
    validate.async({
      birth: this.state.birth,
      gender: this.state.gender      
    }, constraints)
      .then(() => {
        this.props.toNextStep(this.state);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  renderValidationResult(validation) {    
    if (validation) {
      return (<Image
        source={validationOk}
        style={[styles.iconStyle, styles.green]}
      />);
    } else if (!validation && validation != null) {
      return (<Image
        source={validationFalse}
        style={[styles.iconStyle, styles.red]}
      />);
    }
  }

	render() {  
    const isComplete = this.state.cpfValidation && this.state.birthValidation && this.state.genderValidation;
    const btnBgColor = isComplete ? Colors.button_background_login : '#BBB';
    const opacity = isComplete ? 1.0 : 0.3;   

		return (
			<View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, color:Colors.primary }}>
          Insira seus dados
        </Text>
        <View style={{ marginBottom: 10, justifyContent: 'center' }}>
          <TextInputMask
            style={styles.inputStyle}
            placeholder='Data de nascimento*'
            ref={'myDateText'}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            placeholderTextColor='#4C606B'
            underlineColorAndroid='transparent'
            onChange={this.onBirthChanged}            
            onChangeText={birth => this.setState({ birth })}            
            value={this.state.birth}
          />
          {this.renderValidationResult(this.state.birthValidation)}
          {this.state.birthValidation == false ? <Text style={styles.errorStyle}>{'Insira uma data de nascimento válida'}</Text> : null}
        </View>
        <View style={{ marginBottom: 10, justifyContent: 'center' }}>
          <ModalDropdown
            ref={el => { this.genderDropdown = el; }}
            style={styles.dropdownStyle}
            defaultValue={this.getGenderByIndex()}
            options={['Feminino', 'Masculino', 'Outro']}
            onSelect={(index) => this.onGenderPicked(index)}
            textStyle={{ fontSize: 14, color: '#4C606B' }}
            dropdownStyle={{ height: 'auto', width:'80%' }}
            dropdownTextStyle={{ fontSize: 14 }}            
            defaultIndex={Number.parseInt(this.state.genderIndex)}
          />
          <TouchableOpacity
            onPress={() => this.genderDropdown.show()}
            style={{
              position: 'absolute',
              right: 5
            }}
          >
            <Image
              source={arrowImage}
              style={styles.arrowIconStyle}
            />
          </TouchableOpacity>
          {this.state.genderValidation == false ? <Text style={styles.errorStyle}>{'Selecione um genero'}</Text> : null}
        </View>
        <View style={{ marginBottom: 10, justifyContent: 'center' }}>
          <TextInputMask
            style={styles.inputStyle}
            placeholder='CPF*'            
            ref={'myCPFText'}
            type={'cpf'}
            placeholderTextColor='#4C606B'
            underlineColorAndroid='transparent'            
            onChange={this.onCPFChanged}
            onChangeText={cpf => this.setState({ cpf })}            
            value={this.state.cpf}
          />
          {this.renderValidationResult(this.state.cpfValidation)}
          {this.state.cpfValidation == false ? <Text style={styles.errorStyle}>{'Insira um cpf válido'}</Text> : null}
        </View>
        <Button
          buttonColor={btnBgColor}          
          textColor={Colors.button_text_primary}
          onPress={() => this.validateForm()} 
          opacity={opacity}
          disabled={!isComplete}         
        >
          Próximo
        </Button>
			</View>
		);
	}
}

const styles = {
	inputStyle: {
		backgroundColor: 'rgba(255, 255, 255, 1)',
		height: 40,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 4,
		alignSelf: 'stretch',
    borderColor: Colors.primary,
    borderWidth: 1
	},
  dropdownStyle: {
		backgroundColor: 'rgba(255, 255, 255, 1)',
		height: 40,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 4,
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 1
	},
 errorStyle: {
   color: 'red',
 },
 iconStyle: {
   position: 'absolute',    
   right: 5,
   height: 24,
   top: 8,
   width: 24,
  },
  green: {
    tintColor: 'green'
  },
  red: {
    tintColor: 'red'
  },
  arrowIconStyle: {
    tintColor: 'grey',
    height: 24,
    width: 24,
	}
};

export default StoreSurveyStepTwo;
