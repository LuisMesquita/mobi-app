// Import libraries to help create a component
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import HomeAvailableRewardDetail from './HomeAvailableRewardDetail';

// Make a component
class HomeAvailableRewardList extends Component {

  renderRewards() {
    return this.props.rewards.map(reward =>
      <HomeAvailableRewardDetail
        key={reward.Id}
        reward={reward}
        showModal={this.props.showModal}
      />
    );
  }

  render() {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {this.renderRewards()}
        </ScrollView>
    );
  }
}

// Make the component available to other parts of the app
export default HomeAvailableRewardList;
