import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';

import Colors from '../constants/Color';
import { MobiAnalytics } from '../helpers/Analytics';

const arrowRightImage = require('../images/arrow_right.png');
const arrowLeftImage = require('../images/arrow_left.png');

class StoreSurveyStepTwo extends Component {
  state = {
    scores: []
  };

	componentWillMount() {
    this.setState({ scores: this.props.surveyQuestions });
	}

  componentDidMount() {
    MobiAnalytics.shared().trackScreen('RateStore2');
  }

  updateSurveyOptions(index, value) {
    const scores = this.state.scores;

    scores[index].value = value;

    this.setState({ scores });
  }

  isComplete() {
    const scores = this.state.scores;

    var completedCount = 0;
    for (var i = 0; i < scores.length; i++) {
      if (scores[i].value) {
        completedCount++;
      }
    }

    return completedCount === scores.length;
  }

  renderStarScores() {
    return this.state.scores.map((option, index) => {
      return (
        <View
          key={option.Id}
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.gray_light,
            padding: 10,
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Text style={{ fontSize: 14, width: '60%' }}>
            {option.Question}
          </Text>
          <View style={{ width: '40%' }}>
            <StarRating
              starColor={Colors.secondary_medium}
              maxStars={5}
              starSize={20}
              buttonStyle={{ padding: 0, margin: 0 }}
              rating={this.state.scores[index].value}
              selectedStar={(rating) => this.updateSurveyOptions(index, rating)}
            />
          </View>
        </View>
      );
    });
  }

  renderNextButton() {
    return (
      <TouchableOpacity
        onPress={() => this.props.toNextStep(this.state)}        
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
            backgroundColor: Colors.button_background_primary,
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
            Próximo
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
    );
  }

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView vertical showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {this.renderStarScores()}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          
          {this.renderNextButton()}
        </View>
			</View>
		);
	}
}

export default StoreSurveyStepTwo;
