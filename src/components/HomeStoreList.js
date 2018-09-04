// Import libraries to help create a component
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import HomeStoreDetail from './HomeStoreDetail';

// Make a component
class HomeStoreList extends Component {
  renderStores() {
    const data = this.props.stores;
      data.sort((a, b) => {
        return a.Distance - b.Distance;
      });  
      
    return data.map(store =>
      <HomeStoreDetail
        key={store.Id}
        store={store}
        onClickHandler={this.props.onClickHandler}
      />
    );
  }

  render() {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {this.renderStores()}
        </ScrollView>
    );
  }
}

// Make the component available to other parts of the app
export default HomeStoreList;
