import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
// import Colors from '../constants/Color';

import HomeProfileSection from './HomeProfileSection';
import ProfileStatementList from './ProfileStatementList';
import NotificationBadge from './NotificationBadge';
import { MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class ProfileStatementSection extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);

    return {
      headerTitle: 'Extrato',
      headerRight: <NotificationBadge navigation={navigation} />
    };
  };

  state = { statements: [] };

  componentWillMount() {
    this.loadStatement();

    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('UserStatement');
          }
        );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleNotifications: this.handleNotifications
    });
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  loadStatement() {
    axios.post(`${Constants.SERVER_URL}PostExtractApp?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          dateSelected: new Date()
        })}`)
      .then(response => {
        const data = response.data;

        this.setState({
          statements: data
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

  handleNotifications = () => {
    this.props.screenProps.handleNotifications();
  }

  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      >
        <HomeProfileSection
          name={this.props.name}
          CPF={this.props.CPF}
          points={this.props.points}
          imageUrl={this.props.imageUrl}
        />
        <ProfileStatementList statements={this.state.statements} userId={this.props.id} />
      </ScrollView>
    );
  }
}


const mapStateToProps = (state) => ({
  id: state.loggedUser.Id,
  name: state.loggedUser.Name,
  CPF: state.loggedUser.CPF,
  points: (state.currentPoints ? state.currentPoints : 0),
  imageUrl: state.loggedUser.Photo,
});

export default connect(mapStateToProps)(ProfileStatementSection);
