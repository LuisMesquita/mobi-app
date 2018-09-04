// Import libraries to help create a component
import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';

import StoreDetail from './StoreDetail';

// Make a component
class StoreList extends Component {

  renderStores(favoriteList) {
    let data = this.props.storeList;

    data.sort((a, b) => {
      return a.Distance - b.Distance;
    });

    if (this.props.filter !== '' && this.props.filter !== null) {
      data = data.filter(store =>
        store.Name.toLowerCase().includes(this.props.filter.toLowerCase())
      );
      if (data.length <= 0) {
        if (favoriteList) {
          return (
            <Text style={styles.emptyStateTextStyle}>
              Nenhuma loja favoritada
            </Text>
          );
        }

        return (
          <Text style={styles.emptyStateTextStyle}>
            Nenhuma loja encontrada
          </Text>
        );
      }
    }

    if (favoriteList) {
      return data.map(store => {
        if (store.Favorited) {
          return (
            <StoreDetail
              key={store.Id}
              franchise={this.props.franchise}
              store={store}
              favorite={this.props.favorite}
              onClickHandler={this.props.onClickHandler}
            />
          );
        }

        return null;
      });
    }

    return data.map(store => {
      if (!store.Favorited) {
        return (
          <StoreDetail
          key={store.Id}
          franchise={this.props.franchise}
          store={store}
          favorite={this.props.favorite}
          onClickHandler={this.props.onClickHandler}
          />
        );
      }

      return null;
    });
  }

  render() {
    // console.log('StoreList_props', this.props);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderStores(this.props.favorite)}
        </ScrollView>
    );
  }
}

const styles = {
  emptyStateTextStyle: {
    marginHorizontal: 20,
    marginVertical: 10
  }
};

// Make the component available to other parts of the app
export default StoreList;
