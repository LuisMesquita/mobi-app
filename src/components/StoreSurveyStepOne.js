import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import validate from 'validate.js';

import Colors from '../constants/Color';
import { MobiAnalytics } from '../helpers/Analytics';

const arrowRightImage = require('../images/arrow_right.png');

const constraints = {
  recommend: {
    presence: { allowEmpty: false }
  },
  satisfaction: {
    presence: { allowEmpty: false }
  }
};

class StoreSurveyStepOne extends Component {
  state = {
    recommendScore: null,
    satisfactionScore: null
  };

	componentWillMount() {
    this.updateRecommendScore = this.updateRecommendScore.bind(this);
    this.updateSatisfactionScore = this.updateSatisfactionScore.bind(this);

    this.setState({ recommendScore: this.props.recommendScore,
                   satisfactionScore: this.props.satisfactionScore });
	}

  componentDidMount() {
    MobiAnalytics.shared().trackScreen('RateStore1');
  }

  updateRecommendScore(recommendScore) {
    this.setState({ recommendScore });
  }

  updateSatisfactionScore(satisfactionScore) {
    this.setState({ satisfactionScore });
  }

  validateForm() {
    validate.async({
      recommend: this.state.recommendScore,
      satisfaction: this.state.satisfactionScore
    }, constraints)
      .then(() => {
        this.props.toNextStep(this.state);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  renderNextButton() {
    const isComplete = this.state.recommendScore && this.state.satisfactionScore;
    const btnBgColor = isComplete ? Colors.button_background_primary : '#BBB';
    const opacity = isComplete ? 1.0 : 0.3;    
    return (
      <TouchableOpacity
        onPress={() => this.validateForm()}
        disabled={!isComplete}
      >
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 5,
            marginVertical: 10,
            marginHorizontal: 20,
            backgroundColor: btnBgColor,
            borderRadius: 5,
            opacity: opacity,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: '600',
            }}
          >Próximo</Text>
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
    );
  }

	render() {
    console.log('StoreSurveyStepOne', this.props);
    const scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const { recommendScore, satisfactionScore } = this.state;
    console.log(recommendScore);
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.gray_light,
              padding: 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' }}>
              Qual a probabilidade de você
              <Text style={{ fontWeight: 'bold' }}> recomendar </Text>
              este estabelecimento para um amigo?
            </Text>
            <ButtonGroup
              onPress={this.updateRecommendScore}
              selectedIndex={recommendScore}
              buttons={scores}
              containerStyle={{ height: 30, backgroundColor: 'white' }}
              selectedBackgroundColor={Colors.secondary_medium}
              selectedTextStyle={{ color: 'black', fontWeight: 'bold' }}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.gray_light,
              padding: 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' }}>
              O quanto você está
              <Text style={{ fontWeight: 'bold' }}> satisfeito </Text>
              com a sua experiência aqui hoje?
            </Text>
            <ButtonGroup
              onPress={this.updateSatisfactionScore}
              selectedIndex={satisfactionScore}
              buttons={scores}
              containerStyle={{ height: 30, backgroundColor: 'white' }}
              selectedBackgroundColor={Colors.secondary_medium}
              selectedTextStyle={{ color: 'black', fontWeight: 'bold' }}
            />
          </View>
        </View>

          {this.renderNextButton()}

			</View>
		);
	}
}

export default StoreSurveyStepOne;
