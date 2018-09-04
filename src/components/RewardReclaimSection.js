import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Share,
  ImageEditor,
  ImageStore
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import GiftButton from './GiftButton';
import RewardFAQ from './RewardFAQ';
import Colors from '../constants/Color';
import Constants from '../constants/Constants';
import { LoadingImage } from './common';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const miniIcon = require('../images/mini_2x_logo.png');
const shareImage = require('../images/export.png');

let didFocusSubscription = null;

class RewardReclaimSection extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerRight: (
        <TouchableOpacity
          onPress={params.shareReward}
        >
          <Image
            source={shareImage}
            style={{ tintColor:'white', paddingRight: 10, height: 33, width: 33, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    };
  };

  componentWillMount() {
    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('MyRewardDetails');
          }
        );

    this.props.navigation.setParams({ shareReward: this.shareReward.bind(this) });
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  formatDate(stringDate) {
    const date = new Date(stringDate);

    return date.toLocaleDateString('pt-BR');
  }

  shareReward() {
    const { reward } = this.props.navigation.state.params;

    const title = `Acabei de ganhar uma cortesia ${DeviceInfo.getApplicationName()}! :D`;
    const message =
      `Ganhei um ${reward.Title} pelo app da ${DeviceInfo.getApplicationName()}!
Baixe e participe também: ${Constants.APP_URL}`;

    Share.share({ title, message }, { subject: title });

    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'reward_share',
      reward.Id
      );
    
    /*ImageEditor.cropImage(reward.Image.MDPI, { width: 550, height: 430 }, (imageURI) => {
      ImageStore.getBase64ForTag(imageURI, (base64Data) => {
        console.log('base64!!', base64Data);

        Share.share({ title, message, url: `data:image/png;base64,${base64Data}` }, { subject: title });
      }, (reason) => console.error(reason));
    }, (reason) => console.error(reason));*/
  }

  render() {
    const { reward } = this.props.navigation.state.params;
    const {
      rewardScreenStyle,
      containerStyle,
      titleStyle,
      descriptionStyle,
      expirationDateStyle,
      rewardCodeTitleStyle,
      rewardCodeContainerStyle,
      rewardCodeImageStyle,
      rewardCodeStyle,
    } = styles;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}
        >
          <ScrollView style={rewardScreenStyle} showsVerticalScrollIndicator={false}>
            <LoadingImage
              style={{
              flex: 1,
              height: 250,
              width: null,
              marginBottom: 20
              }}
              resizeMode='cover'
              sourceUri={reward.Image.MDPI}  
            />
            <View style={containerStyle}>
              <Text style={titleStyle} >
                { reward.Title }
              </Text>
              <Text style={descriptionStyle}>
                { reward.Description.trim() }
              </Text>
            </View>
            <View style={containerStyle}>
              <Text
                style={rewardCodeTitleStyle}
              >
                Código de resgate
              </Text>
              <View style={rewardCodeContainerStyle} >
                <Image
                  source={miniIcon}
                  style={rewardCodeImageStyle}
                />
                <Text style={rewardCodeStyle} >
                  {reward.IdToHex}
                </Text>
              </View>
              <Text style={expirationDateStyle} >
                Expira em: {this.formatDate(reward.ExpirationAt)}
              </Text>

              {reward.OutletId > 0 &&
                <Text style={expirationDateStyle}>Recompensa válida apenas em algumas lojas {Constants.franchiseName}</Text>
              }
            </View>
            <View style={{ ...containerStyle, display: 'none' }}>
              <GiftButton>
                Enviar como presente
              </GiftButton>
            </View>
            <RewardFAQ />
            <View
              style={{ paddingBottom: 61 }}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  rewardScreenStyle: {
    alignContent: 'space-between',
    // backgroundColor: Colors.primary
    backgroundColor: '#fff'
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 20
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary
  },
  descriptionStyle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },
  expirationDateStyle: {
    fontSize: 16,
    color: '#888',
    marginTop: 10
  },
  rewardCodeTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222'
  },
  rewardCodeContainerStyle: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: Colors.button_background_primary,
    borderWidth: 2
  },
  rewardCodeImageStyle: {
    position: 'absolute',
    left: '25%',
    width: 32,
    height: 32,
    alignSelf: 'center'
  },
  rewardCodeStyle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.button_background_primary,
    marginLeft: 10
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
    lineHeight: 24
  }
};

export default RewardReclaimSection;
