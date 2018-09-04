import React, { Component } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import StoreSingleProfileSection from './StoreSingleProfileSection';
import StoreSingleShowcaseList from './StoreSingleShowcaseList';
import ReclaimRewardModal from '../modals/ReclaimRewardModal';
import RescueRewardModal from '../modals/RescueRewardModal';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

class StoreSingleShowcaseSection extends Component {

  constructor() {
    super();

    this.checkReward = this.checkReward.bind(this);
    this.confirmRewardRescue = this.confirmRewardRescue.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  state = {
    modalVisible: false,
    showcase: [],
    activeModalId: null,
    activeModalImage: null,
    activeModalName: null,
    activeModalDescription: null,
    loading: true,
    rescuedId: null
  };

  componentWillMount() {
    console.log('props_vitrine', this.props);

    axios.post(`${Constants.SERVER_URL}PostRewardsByLocation?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          idLocation: this.props.storeObj.Id
        })}`)
      .then(response => {
        const data = response.data.Rewards;
        console.log('data_vitrine', data);

        const showcaseList = [];

        data.map((reward) => {
          showcaseList.push({
            id: reward.Id,
            name: reward.Title,
            description: reward.Description,
            thumbnail_image_url: reward.Image.XDPI,
            points: reward.Price,
            missing: (reward.Price - this.props.points)
          });

          return 0;
        });

        this.setState({
          showcase: showcaseList,
          loading: false
        });
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

  setUpRewardState(id, image, name, description) {
    this.setState({
      activeModalDescription: description,
      activeModalName: name,
      activeModalId: id,
      activeModalImage: image,
    });
  }

  showConfirmationModal() {
    console.log('show');
    console.log(this.props);
    this.setState({
      modalConfirmationVisible: true,
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    });
  }

  confirmRewardRescue(id, image, name, description) {
    if (!this.props.isLogged) {
      Alert.alert(
        'Cadastro necessário',
        'Entre na sua conta para obter recompensas!',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Login', onPress: () => this.props.handleLogin() },
        ],
        { cancelable: false }
      );
      return;
    }

    this.setUpRewardState(id, image, name, description);
    this.showConfirmationModal();
  }

  checkReward() {
    const { navigateTab } = this.props;

    this.hideModal();
    const rewardId = this.state.rescuedId;
    console.log('checkReward', rewardId);
    navigateTab('Reward', { rewardId });

    this.setState({ rescuedId: null });
  }

  hideModal() {
    // Log modal dismiss on analytics
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'purchase_dismiss',
      this.state.activeModalId
    );

    this.setState({ modalVisible: false });
    this.setState({ modalConfirmationVisible: false });
  }

  rewardRescued(reward) {
    this.setState({ rescuedId: reward.IdToRescue });
    this.deducePoints(reward.Price);
  }

  deducePoints(points) {
    const currentPoints = this.props.points - points;

    this.props.setCurrentPoints(currentPoints);
    this.setState({ modalConfirmationVisible: false });
    setTimeout(this.showModal.bind(this), 500);
  }

  formatDate(date) {
    const day = date.getDate()
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const month = (date.getMonth() + 1)
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const year = date.getFullYear().toString().substr(-2);

    return `${day}/${month}/${year}`;
  }

  render() {
    console.log('myprops', this.props);
    console.log('reward', this.state.showcase);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}> 
        {this.props.isLogged &&
          <StoreSingleProfileSection
            profileImageUrl={this.props.imageUrl}
            name={this.props.name}
            CPF={this.props.CPF}
            currentPoints={this.props.points}
          />
        } 
        <StoreSingleShowcaseList 
          showcases={this.state.showcase} 
          currentPoints={this.props.points}
          onClickHandler={this.confirmRewardRescue.bind(this)}
        />
        <ReclaimRewardModal
          isVisible={this.state.modalVisible}
          hideModal={this.hideModal.bind(this)}
          checkReward={this.checkReward.bind(this)}
          rewardId={this.state.activeModalId}
          rewardImage={this.state.activeModalImage}
          rewardName={this.state.activeModalName}
          storeId={this.props.storeObj.Id}
          rewardDescription={this.state.activeModalDescription}
          date={this.formatDate(new Date())}
        />
        <RescueRewardModal 
          rewardId={this.state.activeModalId}
          rewardName={this.state.activeModalName}
          rewardDescription={this.state.activeModalDescription}
          userId={this.props.id}
          storeId={this.props.storeObj.Id}
          isVisible={this.state.modalConfirmationVisible}
          hideModal={this.hideModal.bind(this)}
          // deducePoints={this.deducePoints.bind(this)}
          rewardRescued={this.rewardRescued.bind(this)}
        />
        {this.state.loading &&
          <View style={styles.loadingStyle}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
      </View>
    );
  }
}

const styles = {
  loadingStyle: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.8,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false
    };
  }

  return {
    isLogged: true,
    id: state.loggedUser.Id,
    name: state.loggedUser.Name,
    CPF: state.loggedUser.CPF,
    points: (state.currentPoints ? state.currentPoints : 0),
    imageUrl: state.loggedUser.Photo
  };
};

export default connect(mapStateToProps, actions)(StoreSingleShowcaseSection);
