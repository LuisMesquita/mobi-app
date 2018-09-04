import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Color';
import SafeAreaView from 'react-native-safe-area-view';
import { isIphoneX } from '../helpers/Utils';

class ApplicationSearchBar extends Component {
  state = {
    notifications: 0
  };

  render() {
    return (      
      <View style={styles.appBar}>
        <SearchBar
          round
          placeholder='Buscar loja'
          containerStyle={styles.searchBarContainerStyle}
          inputStyle={styles.searchBarInputStyle}
          onChangeText={this.props.onTextChanged}
          clearIcon
        />
      </View>      
    );
  }
}

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const PADDING_TOP = getPaddingTop();

function getPaddingTop() {
  if (Platform.OS === 'ios') {
    if (isIphoneX) {
      return 44 
    } else {
      return 20
    }
  
  } else {
    return 0
  }
}

const styles = {
  container: {
    flex: 1,
  },
  appBar: {
    height: APPBAR_HEIGHT + PADDING_TOP,
    paddingTop: PADDING_TOP,
    backgroundColor: Colors.primary,
  },
  searchBarContainerStyle: {
    backgroundColor: Colors.primary,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0
  },
  searchBarInputStyle: {
    backgroundColor: 'white'
  }
};

export default ApplicationSearchBar;
