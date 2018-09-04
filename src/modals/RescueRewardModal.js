import React, { Component } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
import ConfirmationModal from './ConfirmationModal';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

class RescueRewardModal extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible) {
      MobiAnalytics.shared().trackScreen('RewardPurchaseModal');
    }
  }

  reclaimReward() {
    console.log("storeId", this.props.storeId)
    const { userId, rewardId, hideModal, rewardRescued } = this.props;    
    axios.post(`${Constants.SERVER_URL}PostRewardBuy_Buy?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId,
          locationId: this.props.storeId,
          buyId: rewardId,
        })}`)
      .then(response => {
        const data = response.data;

        if (data.HttpStatus === 200) {
          // Log purchase success on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
            'reward_purchase',
            rewardId
          );

          rewardRescued(data.RewardBuy);
        } else {
          // Log purchase failure on analytics
          MobiAnalytics.shared().trackEvent(
            ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
            'reward_purchase',
            rewardId
          );

          Alert.alert(
            data.Title,
            data.Message,
            [
              { text: 'OK', onPress: () => hideModal() },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        // Log purchase failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'reward_purchase',
          rewardId
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

  render() {
    const { rewardName, rewardDescription, isVisible, hideModal } = this.props;

    return (
      <ConfirmationModal
        title={`Você quer resgatar um(a) ${rewardName}`}
        description={rewardDescription}
        confirmText={'Resgatar'}
        confirmAction={this.reclaimReward.bind(this)}
        isVisible={isVisible}
        hideModal={hideModal}
      />
    );
  }
}

export default RescueRewardModal;
