import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import qs from 'qs';
import Permissions from 'react-native-permissions';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import Colors from '../constants/Color';

import CpfRequestModal from '../modals/CpfRequestModal';
import HomeProfileSection from './HomeProfileSection';
import HomeStoreSection from './HomeStoreSection';
import HomeAvailableRewardSection from './HomeAvailableRewardSection';
import HomeCloseRewardSection from './HomeCloseRewardSection';
import HomeSocialSection from './HomeSocialSection';
import HomeHelpSection from './HomeHelpSection';
import NotificationBadge from './NotificationBadge';
import { MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class HomeSection extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <View />,
      headerRight: <NotificationBadge navigation={navigation} />
    };
  };

  state = {
    favoriteStores: [],
    availableRewards: [],
    closeRewards: [],
    loading: true,
    storeId: 0,
    rules: [],
    showCpfModal: false
  };

  componentWillMount() {
    // // subscribe to navigation changes
      didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            () => {
              MobiAnalytics.shared().trackScreen('Home');
            }
          );
  }

  componentDidMount() {
    console.log("homeSectionDidMount", this.props)
    this.props.navigation.setParams({
      handleNotifications: this.handleNotifications 
    });

    const showCpfModal = !this.props.CPF || this.props.CPF.length === 0;
    
    this.setState({ showCpfModal });

    Permissions.check('location').then(checkResponse => {
      if (checkResponse === 'authorized') {
        navigator.geolocation.getCurrentPosition(
          (position) => {            
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            this.props.setLocation({ latitude, longitude });
            this.loadFavoriteStores(latitude, longitude);
          },
          (error) => {            
            this.loadFavoriteStores(0, 0);
          },
          { enableHighAccuracy: false, timeout: 20000 }
        );
      } else {        
        this.loadFavoriteStores(0, 0);
      }
    });
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  hideCpfModal() {    
    this.setState({ showCpfModal: false });
  }

  loadStoreRules(locationId) {
    this.setState({ loading: true });
    axios.post(`${Constants.SERVER_URL}PostLocation?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          idLocation: locationId
        })}`)
      .then(response => {        
        const data = response.data;
        console.log("storeData", data)
        this.setState({
          rules: data.Descriptions,
          loading: false
        })
      })
      .catch(error => {
        this.setState({ loading: false });
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

  loadFavoriteStores(latitude, longitude) { 
    const userId = this.props.id ? this.props.id : -1    

    axios.post(`${Constants.SERVER_URL}PostEstablishmentByApp?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: userId,
          lat: latitude,
          lon: longitude,
          search: ''
        })}`)
      .then(response => {  
        if (response.data.HttpStatus !== 200 && response.data.HttpStatus !== 412) {          
          // this.hideLoadingView();
          this.handleWarning(response.data)                  
        }

        console.log("favoritedStores response " + JSON.stringify(response.data))      
        const data = response.data;//.Map[0].Geo;
        const storeData = data.Map[0].Geo;

        this.props.setStores(storeData);
        this.props.setFranchise(data.Map[0].Name);

        const favoriteStores = [];

        storeData.map((store) => {
          if (store.Favorited) {
            favoriteStores.push({
              id: store.Id,
              name: storeData.Name,
              location: store.Name,
              distance: store.Distance,
              thumbnail: store.LogoURL,
              currentPoints: store.Score,
              favorite: true
            });           
          }

          return 0;
        });

        this.props.setCurrentPoints(storeData[0].Score);        

        this.setState({
          favoriteStores,          
        });        
        this.loadStoreRules(storeData[0].Id);
        console.log('HomeSection', this.props)
        if (this.props.isLogged) {
          this.loadRewards(storeData[0].Id);          
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {        
        console.log(error)
        this.handleWarning(data)              
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

  loadRewards(locationId) {
    axios.post(`${Constants.SERVER_URL}PostRewardsByLocation?${qs.stringify({
          hashApp: Constants.HASH_APP,
          currentVersionApp: Constants.CURRENT_VERSION_APP,
          userId: this.props.id,
          idLocation: locationId
        })}`)
      .then(response => {
        const data = response.data.Rewards;

        // const closeRewards = data.filter((reward) => reward.points - this.props.points > 0, true)
        const closeRewards = data[0]
        const availableRewards = data[0]        
        console.log('LOAD REWARDS')
        this.setState({
          availableRewards,
          closeRewards,          
          loading: false,
          storeId: locationId
        });       

        console.log("homeSectionState",this.state)
        
      })
      .catch(error => {
        this.checkError(error.response.data);
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

  handleWarning = (data) => {    
    this.props.screenProps.handleWarning(data);
  }

  handleNotifications = () => {
    this.props.screenProps.handleNotifications();
  }

  storeHandler(selectedStore) {
    this.props.navigation.navigate('Single', { store: selectedStore });
  }

  profileHandler() {
    this.props.navigation.navigate('Statement');
  }

  helpHandler() {
    this.props.navigation.navigate('Help')    
  }

  renderContent() {
    if (!this.props.isLogged) {
      return (
        <HomeStoreSection
          stores={this.props.nearbyStores}
          onClickHandler={this.storeHandler.bind(this)}
          header='Lojas próximas'
          subHeader='As lojas mais pertinho de você!'
        />
      );
    }    
    return (
      <View>
        <HomeProfileSection
          onClickHandler={this.profileHandler.bind(this)}
          name={this.props.name}
          CPF={this.props.CPF}
          points={this.props.points}
          imageUrl={this.props.imageUrl}
        />
        <HomeStoreSection
          stores={this.props.favoriteStores}
          onClickHandler={this.storeHandler.bind(this)}
        />
        <HomeAvailableRewardSection
          rewards={this.state.availableRewards}
          userId={this.props.id}
          storeId={this.state.storeId}
          navigateTab={this.props.screenProps.navigateTab}
        />
        <HomeCloseRewardSection
          rewards={this.state.closeRewards}
        />
      </View>
    );
  }

  renderCpfModal() {
    console.log(this.props)
    if (this.props.isLogged) {
      return (
        <CpfRequestModal 
          isVisible={this.state.showCpfModal}          
          // isVisible={true}          
          hideModal={this.hideCpfModal.bind(this)}
        />
      );
    }
  }

  render() {
    console.log('imageUrl',this.props.imageUrl)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.homeScreenStyle} showsVerticalScrollIndicator={false}>
          {this.renderContent()}
          <HomeHelpSection 
            onHelpHandler={this.helpHandler.bind(this)}
            rules={this.state.rules}
          />
          <HomeSocialSection />
        </ScrollView>
        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
        {this.renderCpfModal()}
      </View>
    );
  }


}

const styles = {
  homeScreenStyle: {
    flex: 1,
    alignContent: 'space-between',
    backgroundColor: 'white',
    paddingBottom: 50
  },
  loading: {
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
    const orderedStores = state.stores.sort((a, b) => {
      if (a.Distance < b.Distance) {
        return -1;
      }
      if (a.Distance > b.Distance) {
        return 1;
      }
      return 0;
    });

    return {
      isLogged: false,
      nearbyStores: orderedStores.slice(0, 5),
      allStores: orderedStores
    };
  }

  return {
    isLogged: true,
    id: state.loggedUser.Id,
    name: state.loggedUser.Name,
    CPF: state.loggedUser.CPF,
    points: (state.currentPoints ? state.currentPoints : 0),
    imageUrl: state.loggedUser.Photo,
    favoriteStores: state.stores.filter((store) => store.Favorited === true),
  };
};

export default connect(mapStateToProps, actions)(HomeSection);
