import React, { Component } from 'react';
import { 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import qs from 'qs';
import _ from "lodash"
import validate from 'validate.js';
import { UserInputValidation } from './common';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import ProfileEditImage from './ProfileEditImage';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const validationOk = require('../images/ic_done.png');
const validationFalse = require('../images/excluir.png');

let didFocusSubscription = null;
const imagePickerOptions = {
  title: 'Selecione sua imagem',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Tirar foto',
  chooseFromLibraryButtonTitle: 'Escolher da galeria',
  mediaType: 'photo',
  noData: false,
  allowsEditing: true,
  maxWidth: 80,
  maxHeight: 80
};


const constraints = {
  birth: {    
    length: { is: 10 },
    date_custom: true, 
  },  
  gender: {    
    presence: { allowEmpty: false }
  },
  name: {    
    presence: { allowEmpty: false }
  } 
};

class ProfileEditSection extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pontuar',
    headerRight: (
        <TouchableOpacity
          onPress={() => navigation.state.params.validateForm()}
        >
      <Text
        style={{ color: 'white', fontSize: 16, fontWeight: '600', marginRight: 10 }}
      >
        Salvar
      </Text>
    </TouchableOpacity>
      )
    }
  );

  state = {
    name: '', 
    nameValidation: null,   
    gender: -1,
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  }

  componentWillMount() {
    const [birthDay, birthMonth, birthYear] = this.loadBirth(this.props.birth, 'yyyy-mm-dd');
    this.onBirthChanged = this.onBirthChanged.bind(this);    
    this.onBirthChanged = _.debounce(this.onBirthChanged, 20)    

    this.setState({
      name: this.props.name,
      CPF: this.props.CPF,
      gender: this.props.gender,
      birthDay,
      birthMonth,
      birthYear,
      birth: `${birthDay}/${birthMonth}/${birthYear}`
    });

    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('EditProfile');
          }
        );
  }

  componentDidMount() {
    this.props.navigation.setParams({ validateForm: this.validateForm.bind(this) });

    this.genderDropdown.select(this.props.gender);
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  onProfilePicturePressed() {
    console.log('onProfilePicturePressed', true);
    ImagePicker.showImagePicker(imagePickerOptions, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        const source = `data:image/jpeg;base64,${res.data}`;
        console.log(source);

        axios.post(`${Constants.SERVER_URL}PostPhoto?${qs.stringify({
              hashApp: Constants.HASH_APP,
              currentVersionApp: Constants.CURRENT_VERSION_APP,
              userId: this.props.id,
            })}`,
            { base64: source }
          )
          .then(response => {
            const data = response.data;
            console.log(data);

            this.setState({ loading: false });

            if (data.HttpStatus === 200) {
              this.props.setUser(data.User);

              // Log profile picture update success on analytics
              MobiAnalytics.shared().trackEvent(
                ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
                'profile_picture_update'
              );
            } else {
              // Log profile picture update failure on analytics
              MobiAnalytics.shared().trackEvent(
                ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
                'profile_picture_update'
              );

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
            // Log profile picture update failure on analytics
              MobiAnalytics.shared().trackEvent(
                ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
                'profile_picture_update'
              );
              
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


        // this.setState({
        //  avatarSource: source
        // });
      }
    });
  }


  onNameChanged(name) {
    validate.async({ name }, { name: constraints.name })
      .then(() => { this.setState({ name, nameValidation: true }); })
      .catch(() => { this.setState({ name, nameValidation: false }); });    
  }

  onBirthChanged() {    
    const birth = this.state.birth
      validate.async({ birth }, { birth: constraints.birth })
        .then(() => { this.setState({ birthValidation: true }); })
        .catch(() => { this.setState({ birthValidation: false }); });    
  }

  onGenderPicked(index) {
    console.log(index);
    if (index === '0') {      
      this.setState({ genderIndex: index, gender: 'female' });
    } else if (index === '1') {      
      this.setState({ genderIndex: index, gender: 'male' });
    } else if (index === '2') {      
      this.setState({ genderIndex: index, gender: '' });
    }
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

  getGender() {
    if (this.state.gender === 0) {
      return 'female';
    } else if (this.state.gender === 1) {
      return 'male';
    }
    return '';
  }

  validateForm() {    
    console.log("estado", this.state)
    validate.async({
      birth: this.state.birth,
      gender: this.state.gender,
      cpf: this.state.cpf,
      name: this.state.name
    }, constraints)
      .then(() => {
        console.log("Validou o form")
        this.completeEdit();
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  completeEdit = () => {
    this.setState({ loading: true });

    const birth = `${this.state.birthMonth}/${this.state.birthDay}/${this.state.birthYear}`;
    const gender = this.getGender();    

    axios.post(`${Constants.SERVER_URL}PostEditUser?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          name: this.state.name,
          gender,
          birth,
          cpf: this.state.CPF
        })}`)
      .then(response => {
        const data = response.data;

        this.setState({ loading: false });        
        if (data.HttpStatus === 200) {
          this.props.setUser(data.User);

          // Log edit success on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
            'profile_edit'
          );

          Alert.alert(
            data.Title,
            data.Message,
            [
              { text: 'OK', onPress: () => this.props.navigation.goBack() },
            ],
            { cancelable: false }
          );
        } else {
          // Log edit failure on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
            'profile_edit'
          );

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
        // Log edit failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'profile_edit'
        );

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

  loadBirth(birth, type) {
    if (type === 'yyyy-mm-dd') {
      return [
        birth.substring(8, 10),
        birth.substring(5, 7),
        birth.substring(0, 4)
      ];
    }

    return [
      birth.substring(0, 2),
      birth.substring(3, 5),
      birth.substring(6, 10)
    ];
  }

  render() { 
    return (
      <ScrollView
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}        
      >
        <KeyboardAvoidingView
          // style={{ flex: 1 }}
          // keyboardVerticalOffset={40}
          behavior='position'
          // enabled
        >
          <View
            // keyboardVerticalOffset={0}
            style={{ flex: 1, backgroundColor: 'white', padding: 20 }}
          >
            <ProfileEditImage
              imageUrl={this.props.imageUrl}
              changePicture={this.onProfilePicturePressed.bind(this)}
            />
            <Text style={styles.headerStyle}>Email</Text>
            <TextInput
              style={{ ...styles.inputStyle, backgroundColor: 'lightgray' }}
              placeholder='Email'
              autoCapitalize='none'
              returnKeyType='done'
              secureTextEntry={false}
              autoCorrect={false}
              keyboardType='email-address'
              placeholderTextColor='#4C606B'
              underlineColorAndroid='transparent'
              editable={false}
              value={this.props.email}
            />
            <Text style={styles.headerStyle}>Nome</Text>
            <UserInputValidation
              style={styles.inputStyle}
              placeholder='Nome'
              autoCapitalize='words'
              returnKeyType='done'
              secureTextEntry={false}
              autoCorrect={false}
              errorStyle={styles.errorStyle}
              placeholderTextColor='#4C606B'
              underlineColorAndroid='transparent'
              onChangeText={name => this.onNameChanged(name)}
              validation={this.state.nameValidation} 
              error={this.state.nameValidation == false ? 'Insira um nome' : null}
              value={this.state.name}           
            />                      
            <Text style={styles.headerStyle}>CPF</Text>
            <TextInputMask
              style={{ ...styles.inputStyle, backgroundColor: 'lightgray' }}
              placeholder={this.state.CPF}            
              ref={'myCPFText'}
              type={'cpf'}
              editable={false}
              placeholderTextColor='#4C606B'
              underlineColorAndroid='transparent'                          
              value={this.state.CPF}
            />
            <Text style={styles.headerStyle}>Gênero</Text>            
            <View style={{ marginBottom: 10, justifyContent: 'center', position: 'relative' }}>
              <ModalDropdown
                ref={el => { this.genderDropdown = el; }}
                style={styles.dropdownStyle}
                defaultValue={this.getGenderByIndex()}
                options={['Feminino', 'Masculino', 'Outro']}
                onSelect={(index) => this.onGenderPicked(index)}
                textStyle={{ fontSize: 14, color: '#4C606B' }}
                dropdownStyle={{ width:'80%', height: 119 }}
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
              </TouchableOpacity>              
            </View>
            <Text style={styles.headerStyle}>Data de nascimento</Text>
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
          </View>
        </KeyboardAvoidingView>
        <View style={{ height: 61 }} />
      </ScrollView>
    );
  }
}

const styles = {
  headerStyle: {
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: '400'
  },
  inputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    color: '#4C606B',
    alignSelf: 'stretch',
  },
  dropdownStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
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

const mapStateToProps = (state) => ({
  id: state.loggedUser.Id,
  name: state.loggedUser.Name,
  CPF: state.loggedUser.CPF,
  email: state.loggedUser.Email,
  birth: state.loggedUser.Birthday,
  gender: (state.loggedUser.Gender === 'male' ? 1 : 0),
  imageUrl: state.loggedUser.Photo,
  points: (state.currentPoints ? state.currentPoints : 0),
});

export default connect(mapStateToProps, actions)(ProfileEditSection);
