import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import axios from 'axios';
import qs from 'qs';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import GetPointModal from '../modals/GetPointModal';
import { MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class PointCode extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pontuar',
    headerRight: <View />,
    headerLeft: (
      <HeaderBackButton
        tintColor='white'
        onPress={() => {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Camera'
              })
            ]
          });
          navigation.dispatch(resetAction);
        }}
      />
    )
  });

  constructor() {
    super();

    this.showModal = this.showModal.bind(this);
    this.finishModal = this.finishModal.bind(this);
  }

  state = {
    modalVisible: false,
    modalStore: '',
    modalDate: '',
    modalPoints: 0,
    inputCode: ''
  };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('PointsManual');
          }
        );
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  finishModal() {
    this.setState({ modalVisible: false });
    this.props.returnToHome();
  }

  submitCode() {
    axios.post(`${Constants.SERVER_URL}PostGainScoreQrCode?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          hash: Math.round((new Date()).getTime() / 1000),
          code: this.state.inputCode,
        })}`)
			.then(response => {
				const data = response.data;
        console.log(data);

        if (data.HttpStatus === 200) {
          this.setState({
            modalVisible: true,
            modalStore: data.Map.Name,
            modalDate: this.formatDate(new Date()),
            modalPoints: data.PlusScore
          });

          this.props.setCurrentPoints(this.props.points + data.PlusScore);
        } else {
          Alert.alert(
            `${data.TitleHead} ${data.TitleBody}`,
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
          console.log('data1',error);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          console.log('data2',error);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log('error',error);
      });
  }

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#bbb' }}>
				<Text
					style={{
						fontSize: 24,
						color: 'white',
						alignSelf: 'center',
						fontWeight: 'bold',
            marginTop: 20
					}}
				>
					Digite o código
				</Text>
        <TextInput
          style={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
            height: 50,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 4,
            margin: 20,
            borderWidth: 2,
            fontSize: 20,
            borderColor: '#122B32',
            color: '#122B32',
            alignSelf: 'stretch'
          }}
          placeholder='Código'
          autoCapitalize='characters'
          returnKeyType='done'
          placeholderTextColor='#4C606B'
          underlineColorAndroid='transparent'
          value={this.state.inputCode}
          onChangeText={inputCode => this.setState({ inputCode })}
        />
        <TouchableOpacity
          onPress={this.submitCode.bind(this)}
          style={{
            alignSelf: 'center',
            // backgroundColor: Colors.secondary_light,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 5,
            backgroundColor: 'white',
            marginTop: 10,
            shadowColor: 'black',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#122B32',
              fontSize: 16,
              fontWeight: 'bold',
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            Pontuar
          </Text>
        </TouchableOpacity>
        <GetPointModal
          isVisible={this.state.modalVisible}
          finishModal={this.finishModal.bind(this)}
          store={this.state.modalStore}
          date={this.state.modalDate}
          points={this.state.modalPoints}
        />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	id: state.loggedUser.Id,
	points: (state.currentPoints ? state.currentPoints : 0)
});

export default connect(mapStateToProps, actions)(PointCode);
