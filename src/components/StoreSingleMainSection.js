import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Linking,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import axios from 'axios';
import qs from 'qs';
import Svg, { LinearGradient, Stop, Defs, Rect } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import call from 'react-native-phone-call'

import { getStatusBarHeight } from '../helpers/Utils';
import * as actions from '../actions';
import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import { Button, LoadingImage } from './common';
import LinkButton from './LinkButton';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const { height } = Dimensions.get('window');
const distanceImage = require('../images/distance.png');
const starAnimationJson = require('../animations/starAnimation.json');
const phoneImage = require('../images/phone_icon.png');
const timeImage = require('../images/time_icon.png');

class StoreSingleMainSection extends Component {

  state = {
    phone: '',
    descriptions: [],
    address: '',
    latitude: 0,
    longitude: 0,
    url: '',
    reference: '',
    favorite: null,
    loading: true,
    coverImg: '',
    favoriteLoading: false,
    duration: 3,
    isPlaying: false, 
    progress: null,
  };

  componentWillMount() {
    this.handleOpenURL = this.handleOpenURL.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);     

    axios.post(`${Constants.SERVER_URL}PostLocation?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          idLocation: this.props.storeObj.Id
        })}`)
      .then(response => {
        const currentWeekday = new Date().getDay();

        const data = response.data;

        const newState = {
          descriptions: data.Descriptions,
          reference: data.Location.Reference,
          latitude: data.Location.Latitude,
          longitude: data.Location.Longitude,
          url: data.Site,
          favorite: data.Location.Favorited,
          loading: false,
          coverImg: data.Location.CoverURL
        };

        if (data.Location.Favorited) {
          this.setState({ progress: 1 });
        }

        const address = data.Location.Address;
        if (address != null && address.Street !== '') {
          newState.address = `${address.Street}, ${address.Number}, ${address.Additional}`;
        } else {
          newState.address = 'Endereço não disponível';
        }

        const time = data.Location.Hours;
        if (time.length > 0) {
          if (time[currentWeekday].Opened) {
            const open = time[currentWeekday].OpenHour.substring(
              0, time[currentWeekday].OpenHour.lastIndexOf(':')
            );
            const close = time[currentWeekday].CloseHour.substring(
              0, time[currentWeekday].CloseHour.lastIndexOf(':')
            );
            newState.time = `${open}-${close}`;
          } else {
            newState.time = 'Fechado';
          }
        } else {
          newState.time = 'Não disponível';
        }

        const phone = data.Location.Phone[0];
        if (phone != null) {
          newState.phone = `(${phone.DDD}) ${phone.PhoneNumber}`;
        } else {
          newState.phone = 'Não disponível';
        }

        this.setState(newState);
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
  
  toggleFavorite() {
    if (!this.props.isLogged) {
      Alert.alert(
        'Cadastro necessário',
        'Entre na sua conta para favoritar lojas',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Login', onPress: () => this.props.handleLogin() },
        ],
        { cancelable: false }
      );
      return;
    }

    this.handleAnimation();   
    axios.post(`${Constants.SERVER_URL}FavoriteLocation?${qs.stringify({
      hashApp: Constants.HASH_APP,
      currentVersionApp: Constants.CURRENT_VERSION_APP,
      userId: this.props.id,
      locationId: this.props.storeObj.Id
    })}`)
    .then(response => {
      const data = response.data;

      if (data.HttpStatus === 200) {
        const newStores = this.props.stores.slice(0);
        const index = newStores.findIndex((element) => {
          if (element.Id === this.props.storeObj.Id) {
            return true;
          }
          return false;
        });
        newStores[index].Favorited = !newStores[index].Favorited;
        this.props.setStores(newStores);

        this.setState({ favoriteLoading: false, favorite: !this.state.favorite });        

        // Log favorite status on analytics
        const eventLabel = this.state.favorite ? 'favorite_store' : 'unfavorite_store';
        const eventValue = newStores[index].Id;
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
          eventLabel,
          eventValue
        );
      } else {
        this.setState({ favoriteLoading: false });
        Alert.alert(
          'Ocorreu um erro!',
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

  callStorePhone() {    
    const phone = {
      number: this.state.phone, // String value with the number to call
      prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call 
    };

    call(phone).catch(console.error);
  }

  handleOpenURL() {
    Linking.canOpenURL(this.state.url).then(supported => {
      if (supported) {
        Linking.openURL(this.state.url);
      }
    });
  }

  handleAnimation() {        
    if (this.state.favorite) {
      this.animation.reset();
    } else {              
      this.animation.play();
    }
  }

  renderFavoriteImage() {             
    return (        
      <View style={{ width: 50, height: 50 }}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={{ width: 50, height: 50 }}
          source={starAnimationJson}
          progress={this.state.progress}
          enableMergePathsAndroidForKitKatAndAbove
        />
      </View>
    );    
  }

  renderPointsInformation() {
    return (
      this.state.descriptions.map((description) =>
        <View key={description} style={styles.pointsContainerStyle}>
          <View style={styles.yellowCircleStyle} />
          <Text style={styles.listTextStyle}>
            {description}
          </Text>
        </View>
    ));
  }

  renderMapView() {
    const lat = this.state.latitude;
    const lng = this.state.longitude;
    const markerLbl = this.state.reference;

    return (
      <TouchableOpacity
        onPress={() => {
          const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
          const latLng = `${lat},${lng}`;
          const label = markerLbl;
          const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;

          Linking.openURL(url);

          // Log map tap on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
            'map_open',
            this.props.storeObj.Id
          );
        }}
      >
        <MapView
          zoomEnabled={false}
          zoomControlEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          loadingEnabled
          showsMyLocationButton={false}
          region={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.002
          }}
          style={{ height: 250, flex: 1, marginTop: 10 }}
        >
          <MapView.Marker
            coordinate={{ latitude: lat, longitude: lng }}
            title={markerLbl}
            description={this.state.description}
          />
        </MapView>
      </TouchableOpacity>
    );
  }

  renderMainImage(imageHeight) {    
    return (
      <LoadingImage
        style={{ height: imageHeight, width: '100%', flex: 1 }}
        sourceUri={this.state.coverImg}
        // source={{ uri: this.state.coverImg }}
        resizeMode='cover'
        loadingSize='large'
        hasShadow={false}
      />
    );
  }

  render() {
    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;

    let navbarHeight = getStatusBarHeight();
    navbarHeight += Platform.OS === 'ios' ? 64 : 75;
    const tabBarHeight = 58;
    const imageHeight = deviceHeight - navbarHeight - tabBarHeight;

    const fontSize = (deviceWidth - 80 - 42) / 18;
    const imageSize = fontSize + 4;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>          
          {this.renderMainImage(imageHeight)}         
          <Svg
            height={imageHeight}
            width={deviceWidth}
            style={{ position: 'absolute' }}              
          >
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="0" y2="100%">
                <Stop offset="0" stopColor="rgb(0,0,0)" stopOpacity="0" />
                <Stop offset="1" stopColor="rgb(0,0,0)" stopOpacity="1" />
              </LinearGradient>
            </Defs> 
            <Rect
              x="0"
              y="50%"
              width={deviceWidth}
              height={imageHeight}                        
              fill="url(#grad)"
            />            
          </Svg>
          <View style={{ position: 'absolute', left: 20, bottom: 20, width: '80%' }}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                backgroundColor: 'transparent',
                fontWeight: '400',
                marginBottom: 5
              }}
            >
              {this.state.reference}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={distanceImage}
                style={{
                  width: 16,
                  height: 16,
                  marginRight: 5,
                  tintColor: 'white',
                  alignSelf: 'center'
                }}
              />
              <Text
                style={{
                  color: 'white',
                  lineHeight: 16,
                  fontSize: 14,
                  backgroundColor: 'transparent',
                  marginRight: 40
                }}
              >
                {this.state.address}
              </Text>
            </View>
          </View>
          {this.state.favoriteLoading &&
            <View style={styles.loadingStyle}>
              <ActivityIndicator size='large' color={Colors.loading_indicator} />
            </View>
          }
          <TouchableOpacity
            onPress={() => this.toggleFavorite()}
            style={{ position: 'absolute', bottom: 20, right: 20 }}
          >
            {this.renderFavoriteImage()}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderColor: '#ddd',
            borderBottomWidth: 1,
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => this.callStorePhone()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              flex: 1,
              padding: 20,
              borderRightWidth: 1,
              borderColor: '#ddd'
            }}
          >
            <Image
              source={phoneImage}
              style={{ height: imageSize, width: imageSize }}
            />
            <Text
              style={{
                paddingLeft: 5, 
                fontSize,             
              }}
            >
              {this.state.phone}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              flex: 1,
              padding: 20,
              borderLeftWidth: 1,
              borderColor: '#ddd'
            }}
          >
            <Image
              source={timeImage}
              style={{ height: imageSize, width: imageSize }}
            />
            <Text
              style={{
                paddingLeft: 5,                               
                fontSize,
              }}
            >
              {this.state.time}
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingTop: 10,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}
        >
          <Button
            buttonColor={Colors.button_background_primary}
            textColor={Colors.button_text_primary}
            onPress={() => {
              if (!this.props.isLogged) {
                Alert.alert(
                  'Cadastro necessário',
                  'Entre na sua conta para poder avaliar lojas',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Login', onPress: () => this.props.handleLogin() },
                  ],
                  { cancelable: false }
                );
                return;
              }

              this.props.onClickHandler();
            }}
          >
            Avaliar Loja
          </Button>
        </View>
        <View
          style={{
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: Colors.primary,
              fontWeight: 'bold',
              marginLeft: 15,
            }}
          >
            Localização
          </Text>
          {this.renderMapView()}
          <Text
            style={{
              fontSize: 14,
              color: '#ddd',
              marginLeft: 10,
            }}
          >
              {this.state.address}
            </Text>
          </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: Colors.primary,
              fontWeight: 'bold',
              marginBottom: 15
            }}
          >
            Acesse:
          </Text>
          <LinkButton onPress={this.handleOpenURL} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 20,
            paddingBottom: 81
          }}
        >
          <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primary,
            marginBottom: 10
          }}
          >
            Regras de pontuação:
          </Text>
          {this.renderPointsInformation()}
        </View>
        {this.state.loading &&
          <View style={styles.loadingStyle}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = {
  pointsContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  yellowCircleStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8C252'
  },
  listTextStyle: {
    marginLeft: 5,
    color: '#888',
    flexWrap: 'wrap',
    fontSize: 13
  },  
  loadingStyle: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    opacity: 1.0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingTop: (height / 2) - 100,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false,
    };
  }

  return {
    isLogged: true,
    id: state.loggedUser.Id,
    stores: state.stores,
  };
};

export default connect(mapStateToProps, actions)(StoreSingleMainSection);
