import React, { Component } from 'react';
import { View, Text, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text';
import validate from 'validate.js';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash'

import * as actions from '../actions';
import { Button } from '../components/common';
import Colors from '../constants/Color';
import Constants from '../constants/Constants';

const validationOk = require('../images/ic_done.png');
const validationFalse = require('../images/excluir.png');

const constraints = {
  cpf: {
    presence: true,
    cpf: true
  }
};

class CpfRequestModal extends Component {

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboardOpen: true }))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboardOpen: false }))
    this.onCPFChanged = this.onCPFChanged.bind(this);
    this.onCPFChanged = _.debounce(this.onCPFChanged, 100)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  state = {
    cpf: null,
    cpfValidation: null,
    keyboardOpen: false,
  }

  onCPFChanged() { 
    const cpf = this.state.cpf    
    validate.async({ cpf }, { cpf: constraints.cpf })
      .then(() => { this.setState({ cpfValidation: true }); })
      .catch(() => { this.setState({ cpfValidation: false }); });
  }

  validateForm() {
    validate.async({
      cpf: this.state.cpf
    }, constraints)
      .then(() => {
        this.sendCpf();
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  sendCpf() {
    this.setState({ isLading: true });
    axios.post(`${Constants.SERVER_URL}PostEditUser?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          name: this.props.name,
          gender: this.props.gender.toLowerCase(),
          birth: this.props.birth,
          cpf: this.state.cpf
        })}`)
      .then(response => {
        const data = response.data;

        this.setState({ isLoading: false });

        if (data.HttpStatus === 200) {
          this.props.setUser(data.User);

          Alert.alert(
            'Sucesso',
            'CPF atualizado com sucesso!',
            [
              { text: 'Ok', onPress: () => this.props.hideModal() },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Erro',
            data.Message,
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
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
    const { isVisible = false } = this.props;
    const {
      containerStyle,
      titleStyle,
      descriptionStyle,
      inputStyle,
      topCircleStyle,
      bottomCircleStyle,
      backStyle
    } = styles;

    const isComplete = this.state.cpfValidation;
    const btnBgColor = isComplete ? Colors.button_background_primary : '#BBB';
    const btnTextColor = isComplete ? '#fff' : Colors.button_text_primary;
    const opacity = isComplete ? 1.0 : 0.3;
    const paddingBotton = this.state.keyboardOpen ? 160 : 0;

    return (
      <Modal
        isVisible={isVisible}
      > 
        <View style={{ ...containerStyle, marginBottom: paddingBotton }}>
          <View style={topCircleStyle} />
          <View style={bottomCircleStyle} />

          <Text style={titleStyle}>Por favor, insira seu CPF</Text>
          <Text style={descriptionStyle}>Precisamos do seu CPF para garantir a autenticidade de sua conta, além de permitir que você pontue sem o usar o aplicativo. </Text>           
          <View style={{ justifyContent: 'center' }}>
            <TextInputMask
              style={inputStyle}
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
          </View>
          <Button
            buttonColor={btnBgColor}
            opacity={opacity}
            disabled={!isComplete}
            textColor={btnTextColor}
            onPress={this.validateForm.bind(this)}
            style={{ marginTop: 20 }}
          >
            Salvar
          </Button>
          {!Constants.cpfObrigation &&
            <TouchableOpacity onPress={() => this.props.hideModal()}>
              <Text style={backStyle}>
                Voltar para o app
              </Text>
            </TouchableOpacity>          
          }
        </View>        
      </Modal>
    );
  }
}

const styles = {
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
  containerStyle: {
    backgroundColor: 'white',    
    borderRadius: 5,
    overflow: 'hidden',
    padding: 20,    
  },
  titleStyle: {
    fontSize: 22,
    // color: Colors.primary,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: 'transparent'
  },
  descriptionStyle: {
    marginBottom: 15
  },
  inputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    alignSelf: 'stretch',
    borderColor: '#BBB',
    borderWidth: 1,
    // marginTop: 20
  },
  iconStyle: {
    position: 'absolute',    
    right: 5,
    height: 24,
    width: 24,
  },
  green: {
    tintColor: 'green'
  },
  red: {
    tintColor: 'red'
  },
  backStyle: {
    textDecorationLine: 'underline',
    marginTop: 5,
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
};

const mapStateToProps = (state) => ({
  id: state.loggedUser.Id,
  name: state.loggedUser.Name,
  CPF: state.loggedUser.CPF,
  gender: state.loggedUser.Gender,
  birth: state.loggedUser.Birthday,
  points: (state.currentPoints ? state.currentPoints : 0),
  imageUrl: state.loggedUser.Photo,
  favoriteStores: state.stores.filter((store) => store.Favorited === true)
});

export default connect(mapStateToProps, actions)(CpfRequestModal);
