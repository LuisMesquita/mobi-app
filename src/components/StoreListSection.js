import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions';
import ApplicationSearchBar from '../components/ApplicationSearchBar';
import StoreActivitySection from '../components/StoreActivitySection';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

let didFocusSubscription = null;

class StoreListSection extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    filter: ''
  }

  componentWillMount() {
    this.storeHandler = this.storeHandler.bind(this);
    this.onTextChangeHandler = this.onTextChangeHandler.bind(this);

    // subscribe to navigation changes
    didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          () => {
            MobiAnalytics.shared().trackScreen('StoreList');
          }
        );
  }

  componentWillUnmount() {
    didFocusSubscription.remove();
  }

  onTextChangeHandler(text) {
    // Log search on analytics
    MobiAnalytics.shared().trackEvent(
      ANALYTICS_EVENTS_TYPES.BUTTON_TAP,
      'stores_search'
    );
    
    this.filterData(text);
  }

  storeHandler(selectedStore) {
    this.props.navigation.navigate('Single', { store: selectedStore });
  }

  filterData(filter) {
    this.setState({
      filter
    });
  }

  render() {
    // console.log('StoreListSection_props', this.props);
    return (
      <View style={{ flex: 1 }}>
        <ApplicationSearchBar onTextChanged={this.onTextChangeHandler.bind(this)} />
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0, backgroundColor: 'white' }}>
          <ScrollView style={styles.storeScreenStyle} showsVerticalScrollIndicator={false}>
            <StoreActivitySection
              header='Lojas favoritas'
              franchise={this.props.franchise}
              storeList={this.props.stores}
              filter={this.state.filter}
              favorite
              onClickHandler={this.storeHandler.bind(this)}
            />
            <StoreActivitySection
              header='Lojas'
              franchise={this.props.franchise}
              storeList={this.props.stores}
              filter={this.state.filter}
              favorite={false}
              onClickHandler={this.storeHandler.bind(this)}
            />
            <View
              style={{ paddingBottom: 38 }}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  storeScreenStyle: {
    alignContent: 'space-between',
    // backgroundColor: Colors.primary
    backgroundColor: '#fff'
  },
  loading: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.7,
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
      latitude: state.location.latitude,
      longitude: state.location.longitude,
      stores: state.stores,
      franchise: state.franchise
    };
  }

  return {
    id: state.loggedUser.Id,
    latitude: state.location.latitude,
    longitude: state.location.longitude,
    stores: state.stores,
    franchise: state.franchise
  };
};

export default connect(mapStateToProps, actions)(StoreListSection);
