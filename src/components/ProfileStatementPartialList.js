// Import libraries to help create a component
import React, { Component } from 'react';
import { NativeModules, View, Text, TouchableWithoutFeedback, LayoutAnimation, Image} from 'react-native';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
import Colors from '../constants/Color';

import ProfileStatementDetail from './ProfileStatementDetail';

const { UIManager } = NativeModules;
const chevronDown = require('../images/ic_arrow_down.png');
const chevronUp = require('../images/ic_arrow_up.png');

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

// Make a component
class ProfileStatementPartialList extends Component {

  state = { expanded: false, extract: null }

  componentDidMount() {
    if (this.props.extract) {
      this.setState({ expanded: true, extract: this.props.extract });
    }
  }

  componentWillUpdate() {
  }

  renderStatements() {
    if (!this.state.expanded) {
      return null;
    }

    console.log('Extract', this.state.extract);
    if ( this.state.extract != null) {
      if (this.state.extract.length <= 0) {
        return (
          <Text
            style={{ opacity: 0.8, marginHorizontal: 20, marginVertical: 10 }}
          >
            Nenhuma transação neste mês
          </Text>
        );
      }
    }  

    if (this.state.extract) {
      console.log('Extract', true);
      return this.state.extract.map(entry =>
        <ProfileStatementDetail
          key={Math.random() * 100000}
          statement={entry}
          onClickHandler={this.props.onClickHandler}
        />
      );
    }

    axios.post(`${Constants.SERVER_URL}PostExtractApp?${qs.stringify({
					hashApp: Constants.HASH_APP,
					currentVersionApp: Constants.CURRENT_VERSION_APP,
					userId: this.props.userId,
					dateSelected: this.props.utc
				})}`)
			.then(response => {
				const data = response.data;

				this.setState({
					extract: data.Extract
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

  render() {
    const iconImage = !this.state.expanded ? chevronDown : chevronUp;

    return (
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ expanded: !this.state.expanded });
            }}
          >
            <View style={{flexDirection: 'row', justifyContent: 'flex-start' , alignItems: 'center'}}>
              <Text
                style={{
                  marginLeft: 20,
                  marginRight: 3,                  
                  fontSize: 20,                  
                  fontWeight: 'bold',
                  color: Colors.primary
                }}
              >
                {this.props.date}
              </Text>
              <Image source={iconImage} style={{ width: 20, height: 20, tintColor: Colors.primary }} />              
            </View>
          </TouchableWithoutFeedback>
          {this.renderStatements()}
        </View>
    );
  }
}

// Make the component available to other parts of the app
export default ProfileStatementPartialList;
