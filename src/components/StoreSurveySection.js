import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import ProgressBar from 'react-native-progress/Bar';
import axios from 'axios';
import qs from 'qs';

import Constants from '../constants/Constants';
import StoreSurveyStepOne from './StoreSurveyStepOne';
import StoreSurveyStepTwo from './StoreSurveyStepTwo';
import StoreSurveyStepThree from './StoreSurveyStepThree';
import Colors from '../constants/Color';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

const backImage = require('../images/arrow_left_2x.png');

class StoreSurveySection extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: 'Avaliar Loja',
      headerLeft: (
        <TouchableOpacity
          onPress={params.handleBack}
        >
          <Image
            source={backImage}
            style={{ tintColor:'white' }}
          />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    step: 1,
    loading: true,
    surveyQuestions: [],
    recommendScore: null,
    satisfactionScore: null
  };

  componentWillMount() {
    axios.post(`${Constants.SERVER_URL}PostSurveyByLocation?${qs.stringify({
					hashApp: Constants.HASH_APP,
					currentVersionApp: Constants.CURRENT_VERSION_APP,
					idLocation: this.props.navigation.state.params.store.Id,
          userId: this.props.id
				})}`)
			.then(response => {
        const data = response.data;

        if (data.HttpStatus === 200) {
          this.setState({ loading: false, surveyQuestions: data.SurveyQuestions });
        } else {
          this.setState({ loading: false });

          Alert.alert(
            'Erro',
            data.Message,
            [
              { text: 'OK', onPress: () => this.props.navigation.goBack() },
            ],
            { cancelable: false }
          );
        }
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

    this.toNextStep = this.toNextStep.bind(this);
    this.toPreviousStep = this.toPreviousStep.bind(this);
    this.finishSurvey = this.finishSurvey.bind(this);

    this.props.navigation.setParams({ handleBack: this.backBtnPressed.bind(this) });
	}

  backBtnPressed() {
    if (this.state.step === 1) {
      this.props.navigation.dispatch(NavigationActions.back());
    } else {
      this.toPreviousStep();
    }
  }

  toNextStep(state) {
    this.setState({
      step: this.state.step + 1,
      ...state
    });
  }

  toPreviousStep() {
    this.setState({ step: this.state.step - 1 });  
  }

  finishSurvey(state) {
    this.setState({
      loading: true
    });

    let answers = [];
    this.state.surveyQuestions.map((question) => {
      console.log(question);
      answers.push({ ScoreAnswer: question.value, Id: question.Id });

      return 0;
    });
    answers = JSON.stringify(answers);

    let appreciations = {
      NPS: this.state.recommendScore,
      NSI: this.state.satisfactionScore,
      Location: this.props.navigation.state.params.store.Id,
      Comment: state.comment
    };
    appreciations = JSON.stringify(appreciations);

    axios.post(`${Constants.SERVER_URL}PostSurveyAnswer?${qs.stringify({
      hashApp: Constants.HASH_APP,
      currentVersionApp: Constants.CURRENT_VERSION_APP,
      userId: this.props.id,
      answers,
      appreciations
    })}`)
    .then(response => {
      const data = response.data;
      console.log(data);

      this.setState({ loading: false });

      if (data.HttpStatus === 200) {
        // Log success on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_SUCCESS,
          'store_rating',
          this.props.navigation.state.params.store.Id,
        );

        Alert.alert(
          'Sucesso',
          data.Message,
          [
            { text: 'OK', onPress: () => this.props.navigation.goBack() },
          ],
          { cancelable: false }
        );
      } else {
        // Log failure on analytics
        MobiAnalytics.shared().trackEvent(
          ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
          'store_rating',
          this.props.navigation.state.params.store.Id,
        );

        Alert.alert(
          'Erro',
          data.Message,
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      // Log failure on analytics
      MobiAnalytics.shared().trackEvent(
        ANALYTICS_EVENTS_TYPES.ACTION_FAILURE,
        'store_rating',
        this.props.navigation.state.params.store.Id,
      );

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

	renderPageByIndex() {
		switch (this.state.step) {
			case 1:
				return (
          <StoreSurveyStepOne
            satisfactionScore={this.state.satisfactionScore}
            recommendScore={this.state.recommendScore}
            toNextStep={this.toNextStep.bind(this)}
          />
        );
			case 2:
				return (
					<StoreSurveyStepTwo
            surveyQuestions={this.state.surveyQuestions}
						toNextStep={this.toNextStep.bind(this)}
            toPreviousStep={this.toPreviousStep.bind(this)}
					/>
				);
			case 3:
				return (
					<StoreSurveyStepThree
						finishSurvey={this.finishSurvey.bind(this)}
            toPreviousStep={this.toPreviousStep.bind(this)}
					/>
				);
			default:
				return null;
		}
	}

	render() {
		const { store } = this.props.navigation.state.params;
    console.log('StoreSurveySection_render', this.state);

		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
        <ProgressBar
          style={{
            shadowColor: 'black',
            shadowOffset: { width: 5, height: 2 },
            shadowOpacity: 0.6,
            elevation: 4
          }}
          color={Colors.secondary_medium}
          borderRadius={0}
          width={null}
          height={15}
          borderWidth={0}
          progress={this.state.step / 3}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.gray_light,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            source={{ uri: store.LogoURL }}
            style={{ width: 80, height: 60, borderRadius: 5, resizeMode: 'contain' }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{ fontWeight: 'bold', color: Colors.primary, fontSize: 18 }}
            >
              {this.props.franchise}
            </Text>
            <Text
              style={{ color: Colors.primary, fontSize: 16 }}
            >
              {store.Name}
            </Text>
          </View>
        </View>
				<View style={{ flex: 1, paddingBottom: 61 }}>
					{this.renderPageByIndex()}
				</View>
        {this.state.loading &&
					<View style={styles.loadingStyle}>
						<ActivityIndicator size='large' color={Colors.loading_indicator} />
					</View>
				}
			</View>
		);
	}
}

const styles = {
  loadingStyle: {
		position: 'absolute',
		flex: 1,
		backgroundColor: 'white',
		opacity: 0.7,
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
  }
};

const mapStateToProps = (state) => ({
	id: state.loggedUser.Id,
  franchise: state.franchise
});

export default connect(mapStateToProps)(StoreSurveySection);
