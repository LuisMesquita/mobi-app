import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import Colors from '../constants/Color';
import { MobiAnalytics } from '../helpers/Analytics';

const arrowRightImage = require('../images/arrow_right.png');
// const arrowLeftImage = require('../images/arrow_left.png');

class StoreSurveyStepThree extends Component {
  state = {
    comment: '',
  };

  componentDidMount() {
    MobiAnalytics.shared().trackScreen('RateStore1');
  }

  onChangeText(comment) {
    if (this.state === undefined) {
      if (comment === '\n') {
        Keyboard.dismiss();
      } else {
        this.setState({ comment });
      }
      return;
    }

    if (comment.split('\n').length !== this.state.comment.split('\n').length) {
      Keyboard.dismiss();
    } else {
      this.setState({ comment });
    }
  }

	render() {
    console.log('StoreSurveyStepOne', this.props);

		return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View
          style={{ flex: 1, backgroundColor: 'white' }}
        >
          <View
            style={{
              flex: 1,
              padding: 10,
              justifyContent: 'flex-start'
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Deixe um comentário:
            </Text>
            <TextInput
              placeholder='Pode deixar seus elogios, críticas ou sugestões, veremos com cuidado ;)'
              returnKeyType='done'
              numberOfLines={5}
              textAlignVertical={'top'}
              style={{
                borderRadius: 4,
                padding: 5,
                height: '40%',
                minHeight: 60,
                borderColor: 'darkgrey',
                borderWidth: 1,
              }}
              onChangeText={this.onChangeText.bind(this)}
              multiline
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => this.props.finishSurvey(this.state)}
            >
              <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    paddingLeft: 18,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 13,
                    marginVertical: 10,
                    marginHorizontal: 20,
                    backgroundColor: Colors.button_background_primary,
                    borderColor: Colors.button_background_primary,
                    borderRadius: 5,                    
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  Enviar
                </Text>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    alignSelf: 'center',
                    tintColor: Colors.secondary_medium
                  }}
                  source={arrowRightImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
			</TouchableWithoutFeedback>
		);
	}
}

export default StoreSurveyStepThree;
