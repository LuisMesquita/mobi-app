import React, { Component } from 'react';
import { Dimensions, View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import qs from 'qs';
import Permissions from 'react-native-permissions';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import GetPointModal from '../modals/GetPointModal';
import ReclaimRewardModal from '../modals/ReclaimRewardModal';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class PointCamera extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pontuar',
    headerRight: <View/>,
    headerLeft: (
      <HeaderBackButton
        tintColor='white'
        onPress={() => navigation.state.params.handleBackPress()}
      />
    ),    
  });

  constructor() {
    super();

    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.finishModal = this.finishModal.bind(this);
  }

  state = {
    modalVisible: false,
    modalStore: '',
    modalDate: '',
    modalPoints: 0,
    rewardModalVisible: false,    
    rewardModalImage: null,
    rewardModalTitle: null,
    rewardModalDescription: null,
    cameraEnabled: false,
    refresh: false
  };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('PointsScan');
          }
        );
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleBackPress: this.onBackPressed });
    Permissions.check('camera').then(checkResponse => {
      if (checkResponse !== 'authorized') {
        Permissions.request('camera').then(requestResponse => {
          if (requestResponse !== 'authorized') {
            Alert.alert(
              'Atenção',
              'Algumas funcionalidades do aplicativo não estarão' +
              'disponíveis sem a permissão de câmera.',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            );
          }
          this.setState({
            cameraEnabled: true,            
          });
        });
      } else {
      this.setState({
        cameraEnabled: true,            
      });
      }
    });

    this.setState({ refresh: true });
  }

  componentWillUnmount() {
    this.setState({ refresh: false });

    didFocusSubscription.remove();
  }

  onBackPressed = () => {
    this.props.screenProps.onBackPressed();
  }

  onBarCodeRead(e) {     
    const mobiShot = e.data.substr(0, 12).toLowerCase();
    if (mobiShot.indexOf('mobiclubshot') !== -1) {
      this.getReward(e);
    } else {
      this.getPoints(e);
    }    
  }

  getReward(e) {
    axios.post(`${Constants.SERVER_URL}PostRewardShot_Shot?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,          
          qrCode: e.data,          
        })}`)
    .then(response => {
      const data = response.data;

      if (data.HttpStatus === 200) {
        // Log scan success on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
          'code_scan'
        );

        this.setState({
            rewardModalVisible: true,                        
            rewardModalName: data.RewardShot.Title,
            rewardModalImage: data.RewardShot.Image.XDPI,
            rewardModalDescription: data.RewardShot.Description,
          });
      } else {
        // Log scan failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'code_scan'
        );

        Alert.alert(
          `${data.TitleHead} ${data.TitleBody}`,
          data.Message,
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      // Log scan failure on analytics
      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
        'code_scan'
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

  getPoints(e) {
     axios.post(`${Constants.SERVER_URL}PostGainScoreQrCode?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          netStatus: 1,
          so: 0,
          hash: Math.round((new Date()).getTime() / 1000),
          code: e.data,
          lessMinute: 0
        })}`)
      .then(response => {
        const data = response.data;

        if (data.HttpStatus === 200) {
          // Log scan success on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
            'code_scan'
          );

          this.setState({
            modalVisible: true,
            modalStore: data.Map.Name,
            modalDate: this.formatDate(new Date()),
            modalPoints: data.PlusScore
          });

          this.props.setCurrentPoints(this.props.points + data.PlusScore);
        } else {
          // Log scan failure on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
            'code_scan'
          );

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
        // Log scan failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'code_scan'
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

  finishModal() {
    this.setState({ 
      modalVisible: false,
      rewardModalVisible:false,
      });
    this.props.screenProps.onBackPressed();
  }

  goToWriteCode() {
    const navigation = this.props.navigation;

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Code',
          params: { returnToHome: this.props.screenProps.onBackPressed }
        })
      ]
    });
    navigation.dispatch(resetAction);
  }

  formatDate(date) {
    const day = date.getDate()
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const month = (date.getMonth() + 1)
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const year = date.getFullYear().toString().substr(-2);

    return `${day}/${month}/${year}`;
  }

  renderQRCodeScanner() {
    return (
      <View
        style={{ width: '100%', height: '100%' }}
      >        
        <QRCodeScanner
          onRead={this.onBarCodeRead.bind(this)}
          reactivate={this.state.refresh}
          reactivateTimeout={5000}          
          showMarker
          cameraStyle={{ height: '100%' }}
          containerStyle={{ height: '100%' }}
          topViewStyle={{ display: 'none' }}
          bottomViewStyle={{ display: 'none' }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent', position:'relative' }}>
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            alignSelf: 'center',
            fontWeight: 'bold',
            marginTop: 20,
            zIndex: 40
          }}
        >
          Leia o código
        </Text>
        <View style={{alignItems: 'center', position: 'absolute', top: 0, bottom: 0 }}>
          {this.state.cameraEnabled ? this.renderQRCodeScanner() : null}
        </View>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            alignSelf: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 20,
            textAlign: 'center'
          }}
        >
          Aponte a câmera para o código, espere processar e receba seus pontos!
        </Text>
          {/*<TouchableOpacity
            onPress={this.goToWriteCode.bind(this)}
            style={{
              position: 'absolute',
              bottom: 30,
              justifyContent: 'flex-end',
              alignSelf: 'center',
              paddingBottom: 10
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                alignSelf: 'center'
              }}
            >
              Não consigo pontuar,
              <Text style={{ textDecorationLine: 'underline' }}>
                {'\n'}inserir manualmente
              </Text>
            </Text>
          </TouchableOpacity>*/}
        <GetPointModal
          isVisible={this.state.modalVisible}
          finishModal={this.finishModal.bind(this)}
          store={this.state.modalStore}
          date={this.state.modalDate}
          points={this.state.modalPoints}
        />
        <ReclaimRewardModal
          isVisible={this.state.rewardModalVisible}
          hideModal={this.finishModal.bind(this)}                    
          rewardImage={this.state.rewardModalImage}
          rewardName={this.state.rewardModalName}
          rewardDescription={this.state.rewardModalDescription}
          date={this.formatDate(new Date())}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  id: state.loggedUser.Id,
  points: (state.currentPoints ? state.currentPoints : 0)
});

export default connect(mapStateToProps, actions)(PointCamera);
