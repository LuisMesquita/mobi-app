import React, { Component } from 'react';
import { View, Text, SectionList } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
import RewardActiveDetail from './RewardActiveDetail';
import RewardInactiveDetail from './RewardInactiveDetail';
import Colors from '../constants/Color';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

import NotificationBadge from './NotificationBadge';

let didFocusSubscription = null;

class RewardListSection extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <View />,
    headerRight: <NotificationBadge navigation={navigation} />
  });

  state = {
    activeRewards: [],
    inactiveRewards: [],
    isLoading: true
  };

  componentWillMount() {
    this.rewardHandler = this.rewardHandler.bind(this);

    this.loadRewards();

    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('MyRewardsList');
          }
        );
  }

  componentDidMount() {
    console.log('RewardListSection_props', this.props);
    this.props.navigation.setParams({
      handleNotifications: this.handleNotifications
    });
  }

  componentWillReceiveProps(nextProps) {
    const { rewardId } = this.props.screenProps;
    const { rewardId: nextRewardId } = nextProps.screenProps;
    if (rewardId !== nextRewardId) {
      this.loadRewards(() => {
        for (let i = 0; i < this.state.activeRewards.length; i++) {
          const currReward = this.state.activeRewards[i];
          if (currReward.IdToRescue === nextRewardId) {
            this.rewardHandler(currReward);
            return;
          }
        }
      });
    }
  }

  componentWillUnmoun() {
    didFocusSubscription.remove();
  }

  loadRewards(callback) {
    this.setState({ isLoading: true });

    axios.post(`${Constants.SERVER_URL}PostRewardsByUser?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id
        })}`)
    .then(response => {
      const data = response.data.Rewards;

      const activeList = [];
      let inactiveList = [];

      data.map(reward => {
        if (reward.Expired === false && reward.Redeemed === false) {
          activeList.push(reward);
        } else if (reward.Redeemed) {
          inactiveList.push({
            ...reward,
            Date: reward.RedeemedAt
          });
        } else {
          inactiveList.push({
            ...reward,
            Date: reward.ExpirationAt
          });
        }
        return 0;
      });

      inactiveList = inactiveList.sort(
        (a, b) => new Date(b.Date) - new Date(a.Date)
      );

      this.setState({
        activeRewards: activeList,
        inactiveRewards: inactiveList,
        isLoading: false
      });
      callback();
    })
    .catch(error => {
      this.setState({ isLoading: false });
      console.log(error);
    });
  }

  handleNotifications = () => {
    this.props.screenProps.handleNotifications();
  }

  rewardHandler(selectedReward) {
    this.props.navigation.navigate('Reclaim', { reward: selectedReward });
  }

  swipeHandler(swipedReward) {
    axios.post(`${Constants.SERVER_URL}PostRewardDelete?${qs.stringify({
      hashApp: Constants.HASH_APP,
      currentVersionApp: Constants.CURRENT_VERSION_APP,
      userId: this.props.id,
      rewardId: swipedReward.IdToRescue,
      rewardType: swipedReward.Type
    })}`)
    .then(response => {
      const data = response.data;

      if (data.HttpStatus === 200) {
        let list = this.state.inactiveRewards.slice(0);
        list = list.filter((item) => item.Id !== swipedReward.Id);

        this.setState({ inactiveRewards: list });
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

  renderActiveItem({ item }) {
    return (
      <RewardActiveDetail
        key={item.IdToRescue}
        reward={item}
        onClickHandler={this.rewardHandler.bind(this)}
      />
    );
  }

  renderInactiveItem({ item }) {
    return (
      <RewardInactiveDetail
        key={item.IdToRescue}
        reward={item}
        swipeHandler={this.swipeHandler.bind(this)}
      />
    );
  }

  renderSectionHeader(info) {
    const { title, description } = info.section;
    const {
      headerContainerStyle,
      headerTitleStyle,
      headerDescStyle
    } = styles;

    return (
      <View style={headerContainerStyle}>
        <Text
          style={headerTitleStyle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {title}
        </Text>
        <Text
          style={headerDescStyle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {description}
        </Text>
      </View>
    );
  }

  renderEmptyState() {
    return (
      <Text style={styles.emptyStateTextStyle}>
        Você não possui recompensas.{'\n'} Acumule pontos e troque.
      </Text>
    );
  }

  render() {
    if (this.state.activeRewards.length === 0 && this.state.inactiveRewards.length === 0) {
      return this.renderEmptyState();
    }

    return (
        <SectionList
          sections={[
            {
              data: this.state.activeRewards,
              renderItem: this.renderActiveItem.bind(this),
              title: 'Recompensas Disponíveis',
              description: 'Recompensas que você pode utilizar agora'
            },
            {
              data: this.state.inactiveRewards,
              renderItem: this.renderInactiveItem.bind(this),
              title: 'Recompensas Não Disponíveis',
              description: 'Recompensas que você já utilizou ou que venceram'
            },
          ]}
          ListFooterComponent={<View style={{ height: 61 }} />}
          renderSectionHeader={this.renderSectionHeader}
          stickySectionHeadersEnabled={false}
          style={{ backgroundColor: 'white' }}
          onRefresh={() => {
            // Log pull to refresh on analytics
            MobiAnalytics.shared().trackEvent(
              ANALYTICS_EVENTS_TYPES.PULL_TO_REFRESH,
              'my_rewards_list'
            );

            this.loadRewards.bind(this);
          }}
          refreshing={this.state.isLoading}

        />
    );
  }
}

const styles = {
  headerContainerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20
  },
  headerTitleStyle: {
    fontSize: 22,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    color: Colors.text_title,
  },
  headerDescStyle: {
    fontSize: 14,
    paddingHorizontal: 20,
    color: '#bbb',
  },


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
  },
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
  },
  emptyStateTextStyle: {
    textAlign: 'center',
    marginTop: 20,
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {};
  }

  return {
    id: state.loggedUser.Id
  };
};

export default connect(mapStateToProps)(RewardListSection);
