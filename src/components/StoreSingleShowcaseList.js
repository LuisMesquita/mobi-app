// Import libraries to help create a component
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import StoreSingleShowcaseDetail from './StoreSingleShowcaseDetail';

// Make a component
class StoreSingleShowcaseList extends Component {
  renderShowcase(showcases) {
    console.warn('showcase', showcases)
    return showcases.map(showcase =>
      <StoreSingleShowcaseDetail
        key={showcase.id}
        showcase={showcase}
        currentPoints={this.props.currentPoints}
        onClickHandler={this.props.onClickHandler}
      />
    );
  }

  render() {
    // console.log(this.state);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderShowcase(this.props.showcases)}
          <View
            style={{ paddingBottom: 48 }}
          />
        </ScrollView>
    );
  }
}

// Make the component available to other parts of the app
export default StoreSingleShowcaseList;
