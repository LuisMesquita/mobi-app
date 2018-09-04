import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

import RulesModal from '../modals/RulesModal';

import * as actions from '../actions';
import Constants from '../constants/Constants';
import Colors from '../constants/Color';

import { Section, Button } from './common';
import { ANALYTICS_EVENTS_TYPES, MobiAnalytics } from '../helpers/Analytics';

class HomeHelpSection extends Component {
  
  state = {  
    showRulesModal: false 
  }  

  showRulesModal() {
    this.setState({
      showRulesModal: true,
    })
  }

  HideRulesModal() {    
    this.setState({
      showRulesModal: false,
    }) 
  }
  
  render() {    
    return (      
      <Section
        header='Centro de Ajuda'
        subHeader='Veja as regras do clube e também tire suas duvidas.'        
      >            
        <RulesModal 
          isVisible={this.state.showRulesModal}                        
          hideModal={this.HideRulesModal.bind(this)}
          onBackPress={this.HideRulesModal.bind(this)}
          data={this.props.rules}
        />

        <View
          style={styles.containerStyle}
        >  
          <Button
            buttonColor={Colors.button_background_primary}
            textColor={Colors.button_text_primary}
            style={styles.buttonStyle}
            onPress={() => {this.showRulesModal()}}
          >
            Regras do clube
          </Button>
          <Button
            buttonColor={Colors.button_background_primary}
            textColor={Colors.button_text_primary}
            style={styles.buttonStyle}
            onPress={() => this.props.onHelpHandler()}
          >
            Ajuda
          </Button>    
        </View>
      </Section>
    );    
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',    
  },
  buttonStyle: {
    flex: 0.4,            
    paddingVertical: 5,
  },
};

export default connect(null, actions)(HomeHelpSection);
