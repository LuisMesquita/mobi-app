import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import SafeAreaView from 'react-native-safe-area-view';

import Colors from '../constants/Color';
import TutorialPage from '../components/TutorialPage';
import { MobiAnalytics } from '../helpers/Analytics';

const arrowRightImage = require('../images/arrow_right.png');
const tutorialImg1 = require('../images/tutorial-1.png');
const tutorialImg2 = require('../images/tutorial-2.png');
const tutorialImg3 = require('../images/tutorial-3.png');

class TutorialContainer extends Component {
  
  state = {
    currentIndex: 0
  }

  componentDidMount() {
    this.trackScreenView();
  }

  trackScreenView() {
    const page = this.state.currentIndex + 1;
    MobiAnalytics.shared().trackScreen(`Tutorial${page}`);
  }

  closeTutorial() {
    console.log('close modal');
    this.props.navigation.goBack(null);
  }

  onIndexChanged(index) {
    this.setState({ currentIndex: index });

    this.trackScreenView();
  }

  renderMainButton() {
    if (this.state.currentIndex === 2) {
      return (
        <TouchableOpacity
          onPress={this.closeTutorial.bind(this)}
        >
          <View style={styles.nextBtnContainerStyle}>
            <Text style={styles.nextBtnTxtStyle}>Entrar</Text>
            <Image
              source={arrowRightImage}
              style={{ tintColor:'#FFDD6F' }}
            />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.pageSwiper.scrollBy(1);
        }}
      >
        <View style={styles.nextBtnContainerStyle}>
          <Text style={styles.nextBtnTxtStyle}>Próximo</Text>
          <Image
            source={arrowRightImage}
            style={{ tintColor:'#FFDD6F' }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      tutorialContainerStyle,
      dotStyle,
      activeDotStyle,
      bottomContainerStyle,
      skipBtnStyle,
    } = styles;

    return (
      <SafeAreaView style={tutorialContainerStyle}>
        <Swiper
          loop={false}
          dotStyle={dotStyle}
          activeDotStyle={{ ...dotStyle, ...activeDotStyle }}
          ref={(swiper) => { this.pageSwiper = swiper; }}
          onIndexChanged={this.onIndexChanged.bind(this)}
          bounces
        >
          <TutorialPage
            image={tutorialImg1}
            pageTitle={'Bem Vindo!'}
            description='Aqui você terá acesso a todas
              as informações das nossas redes
              e ainda participará do nosso clube de fidelidade!'
          />
          <TutorialPage
            image={tutorialImg2}
            pageTitle={'Pontue!'}
            description='Toda vez que você consumir alguma coisa,
              na nota fiscal irá aparecer um código,
              basta ler esse código para obter pontos!'
          />
          <TutorialPage
            image={tutorialImg3}
            pageTitle={'Ganhe Recompensas!'}
            description='Ao juntar pontos, você poderá resgatar
              recompensas exclusivas do nosso clube!'
          />
        </Swiper>
        
        <View style={bottomContainerStyle}>
          <TouchableOpacity
            onPress={this.closeTutorial.bind(this)}
          >
            <Text style={skipBtnStyle}>Pular</Text>
          </TouchableOpacity>

          {this.renderMainButton()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  tutorialContainerStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  dotStyle: {
    height: 11,
    width: 11,
    borderRadius: 6,

    marginLeft: 9,
    marginRight: 9,

    backgroundColor: Colors.tutorial_dot_color
  },
  activeDotStyle: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,

    backgroundColor: Colors.tutorial_active_dot_color
  },
  bottomContainerStyle: {
    // height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: 30,
    paddingTop: 0
  },
  skipBtnStyle: {
    color: 'rgba(83, 83, 83, 0.5)',
    fontSize: 18,
    fontWeight: '600',
  },
  nextBtnContainerStyle: {
    flexDirection: 'row',
    backgroundColor: Colors.button_background_primary,
    borderRadius: 6,

    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,

    width: 120,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextBtnTxtStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
};

export default TutorialContainer;
