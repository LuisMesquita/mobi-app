// Import libraries to help create a component
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import HomeCloseRewardDetail from './HomeCloseRewardDetail';

// Make a component
class HomeCloseRewardList extends Component {
  renderRewards() {
    return this.props.rewards.map(reward =>
      <HomeCloseRewardDetail key={reward.Id} reward={reward} />
    );
  }

  render() {
    // console.log(this.state);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {this.renderRewards()}
        </ScrollView>
    );
  }
}

// Make the component available to other parts of the app
export default HomeCloseRewardList;
