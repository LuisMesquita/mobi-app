import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { ButtonGroup } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
import Colors from '../constants/Color';
import StoreSingleMenuList from './StoreSingleMenuList';

class StoreSingleMenuSection extends Component {
  state = { selectedIndex: 0, data: null, loading: true };

  componentWillMount() {
    console.log('StoreSingleMenuSection_props', this.props);

    this.data = [];
    this.updateIndex = this.updateIndex.bind(this);

    const { storeObj } = this.props;

    axios.post(`${Constants.SERVER_URL}PostStoreByLocation?${qs.stringify({
        hashApp: Constants.HASH_APP,
        currentVersionApp: Constants.CURRENT_VERSION_APP,
        idLocation: storeObj.Id,
        idLanguage: 1,
        userId: this.props.id
      })}`)
      .then(response => {
        this.data = response.data.Group;
        console.log(this.data);

        this.setState({ data: this.data[0], loading: false });
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

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex, data: this.data[selectedIndex] });
  }

  renderButtonGroup() {
    const buttons = [];
    const { selectedIndex } = this.state;

    // console.log('state.data', this.data);
    if (this.data.length > 0) {
      this.data.map((group) =>
        buttons.push(group.Name)
      );
    }
    // console.log(buttons);

    return (
      <View style={{ height: 40 }}>
        <ScrollView
          style={{ backgroundColor: 'white', borderWidth: 0, top: 0, zIndex: 20 }}
          horizontal showsHorizontalScrollIndicator={false}
        >
          <ButtonGroup
            onPress={this.updateIndex.bind(this)}
            buttons={buttons}
            selectedIndex={selectedIndex}
            containerStyle={{ backgroundColor: 'white', height: 35, borderWidth: 0 }}
            textStyle={{ color: '#aaa', fontSize: 18, marginVertical: 15, marginHorizontal: 10, paddingVertical: 5, }}
            selectedTextStyle={styles.selectedCategoryStyle}
            innerBorderStyle={{ color: 'white' }}
            disableSelected
          />
        </ScrollView>
      </View>
    );
  }

  renderMenu() {
    return (
      <StoreSingleMenuList
        menu={this.state.data}
        onClickHandler={this.props.onClickHandler.bind(this)}
        renderHeader={this.renderButtonGroup.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {this.renderButtonGroup()}
        { this.renderMenu() }
        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size='large' color={Colors.loading_indicator} />
          </View>
        }
      </View>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedCategoryStyle: {
    color: Colors.primary,
    fontWeight: 'bold',
    borderBottomWidth: 3,
    // borderBottonRadius: 2,
    borderBottomColor: Colors.primary
  }
};

const mapStateToProps = (state) => {
  if (!state.loggedUser) {
    return {
      isLogged: false,
    }
  }

  return {
    isLogged: true,
    id: state.loggedUser.Id
  };
};

export default connect(mapStateToProps)(StoreSingleMenuSection);
