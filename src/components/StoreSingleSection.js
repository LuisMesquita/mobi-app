import React, { Component } from 'react';
import { View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import StoreSingleMainSection from './StoreSingleMainSection';
import StoreSingleShowcaseSection from './StoreSingleShowcaseSection';
import StoreSingleMenuSection from './StoreSingleMenuSection';
import Colors from '../constants/Color';
import { MobiAnalytics } from '../helpers/Analytics';

class StoreSingleSection extends Component {
  state = { selectedIndex: 0 };

  componentWillMount() {
    this.updateIndex = this.updateIndex.bind(this);
    this.menuHandler = this.menuHandler.bind(this);
    this.surveyHandler = this.surveyHandler.bind(this);
  }

  updateIndex(selectedIndex) {
    console.log(selectedIndex);
    this.setState({ selectedIndex });
  }

  menuHandler(item) {
    this.props.navigation.navigate('Menu', { item });
  }

  surveyHandler() {
    const { store } = this.props.navigation.state.params;
    this.props.navigation.navigate('Survey', { store });
  }

  renderPageByIndex(store) {
    switch (this.state.selectedIndex) {
      case 0:
        MobiAnalytics.shared().trackScreen('StoreDetails');
        return (
          <StoreSingleMainSection
            storeObj={store}
            onClickHandler={this.surveyHandler.bind(this)}
            handleLogin={() => this.props.screenProps.handleLogin()}
          />
        );
      case 1:
        MobiAnalytics.shared().trackScreen('StoreShowcase');
        return (
          <StoreSingleShowcaseSection
            storeObj={store}
            navigateTab={this.props.screenProps.navigateTab}
            handleLogin={() => this.props.screenProps.handleLogin()}
          />
        );
      case 2:
        MobiAnalytics.shared().trackScreen('StoreMenu');
        return (
          <StoreSingleMenuSection
            storeObj={store}
            onClickHandler={this.menuHandler.bind(this)}
            handleLogin={() => this.props.screenProps.handleLogin()}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const buttons = ['Loja', 'Vitrine', 'Cardápio'];
    const { selectedIndex } = this.state;
    const { store } = this.props.navigation.state.params;
    // console.log('store', store);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ backgroundColor: Colors.header_background, borderWidth: 0 }}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ backgroundColor: Colors.header_background, height: 30 }}
            containerBorderRadius={2}
            textStyle={{ color: 'white' }}
            selectedTextStyle={{ color: Colors.primary }}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          {this.renderPageByIndex(store)}
        </View>
      </View>
    );
  }
}

export default StoreSingleSection;
