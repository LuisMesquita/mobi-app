// Import libraries to help create a component
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';

import StoreSingleMenuDetail from './StoreSingleMenuDetail';

// Make a component
class StoreSingleMenuList extends Component {

  keyExtractor = (item, index) => item.id;

  renderItem(menuItem) {
    const onClickHandler = this.props ? this.props.onClickHandler : null;

    return (
      <StoreSingleMenuDetail
        key={menuItem.Id}
        id={menuItem.Id}
        item={menuItem}
        onClickHandler={onClickHandler}
      />
    );
  }

  renderHeader() {
    return this.props ? this.props.renderHeader() : null;
  }

  render() {
    const items = this.props.menu ? this.props.menu.Itens : [];

    return (
      <FlatList
        data={items}
        renderItem={this.renderItem.bind(this)}
        keyExtractor={this.keyExtractor}
        // ListHeaderComponent={this.renderHeader.bind(this)}
        ListFooterComponent={<View style={{ height: 61 }} />}
      />
    );
  }
}

// Make the component available to other parts of the app
export default StoreSingleMenuList;
