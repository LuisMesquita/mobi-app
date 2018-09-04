import React, { Component } from 'react';
import { connect } from 'react-redux';

import { formatDate } from '../helpers/Utils';
import * as actions from '../actions';
import { Section } from './common';
import HomeAvailableRewardList from './HomeAvailableRewardList';
import RescueRewardModal from '../modals/RescueRewardModal';
import ReclaimRewardModal from '../modals/ReclaimRewardModal';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

class HomeAvailableRewardSection extends Component {
  
  state = {
    activeModalId: null,
    activeModalName: null,
    activeModalDescription: null,
    activeModalImage: null,

    userId: null,
    modalConfirmationVisible: false,
    modalSuccessVisible: false,

    rescuedId: null
  }

  rewardRescued(reward) {
    this.setState({ rescuedId: reward.IdToRescue });
    this.deducePoints(reward.Price);
  }

  deducePoints(points) {
    this.props.removePoints(points);

    this.showSuccessModal();
  }

  showSuccessModal() {
    this.setState({
      modalConfirmationVisible: false
    });
    setTimeout(() => {
      this.setState({
        modalSuccessVisible: true
      });
    }, 500);
  }

  showModal(id, name, description, image) {
    this.setState({
      activeModalId: id,
      activeModalName: name,
      activeModalImage: image,
      activeModalDescription: description,
    });

    this.setState({ modalConfirmationVisible: true });
  }

  hideModal() {
    // Log modal dismiss on analytics
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'purchase_dismiss',
      this.state.activeModalId
    );

    this.setState({
      modalConfirmationVisible: false,
      modalSuccessVisible: false
    });
  }

  checkReward() {
    const { navigateTab } = this.props;

    this.hideModal();
    const rewardId = this.state.rescuedId;
    navigateTab('Reward', { rewardId });

    this.setState({ rescuedId: null });
  }

  render() {
    if (this.props.rewards.length > 0) {
      return (
        <Section
          header='Troque seus pontos!'
          subHeader='Recompensas disponíveis para você.'
        >
          <HomeAvailableRewardList
            rewards={this.props.rewards}
            showModal={this.showModal.bind(this)}
          />
          <ReclaimRewardModal
            isVisible={this.state.modalSuccessVisible}
            hideModal={this.hideModal.bind(this)}
            checkReward={this.checkReward.bind(this)}
            rewardId={this.state.activeModalId}
            rewardImage={this.state.activeModalImage}
            rewardName={this.state.activeModalName}
            rewardDescription={this.state.activeModalDescription}
            storeId={this.props.storeId}
            date={formatDate(new Date())}
          />
          <RescueRewardModal 
            rewardId={this.state.activeModalId}
            rewardName={this.state.activeModalName}
            rewardDescription={this.state.activeModalDescription}
            rewardImage={this.state.activeModalImage}
            userId={this.props.userId}
            storeId={this.props.storeId}
            isVisible={this.state.modalConfirmationVisible}
            hideModal={this.hideModal.bind(this)}
            // deducePoints={this.deducePoints.bind(this)}
            rewardRescued={this.rewardRescued.bind(this)}
          />
        </Section>
      );
    }

    return null;
  }
}

export default connect(null, actions)(HomeAvailableRewardSection);
