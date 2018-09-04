import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

import { Section, Button, ModalBody } from '../components/common';
import Colors from '../constants/Color';

const backImage = require('../images/excluir.png');

class RulesModal extends Component {   
  renderPointsInformation() {
    return (
      this.props.data.map((description) => 
        <View key={description} style={styles.pointsContainerStyle}>          
          {this.renderRulesText(description)}
        </View>
    ));
  }

  renderRulesText(rule) {
    var rules = rule.split(":")

    return(
      <Text style={styles.listTextStyle}>
        {rules[0]}
        {rules.length > 1 &&                     
          <Text>
            {":\n"}
            {rules[1]}
          </Text>
        }
      </Text>
    )
  }

  render() {
    const {
      hideModal,
      onBackPress,
      isVisible = false
    } = this.props    

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={hideModal}
      >
        <ModalBody
          isVisible={isVisible}          
          onBackPress={onBackPress}          
          header='Regras de Uso'
          subHeader='Para utilizar o clube em seu maior proveito, conheça nossas regras!'                   
        >  
         <View>
          {this.renderPointsInformation()}
         </View>         
        </ModalBody>
      </Modal>
    );
  }
}

const styles = {    
  pointsContainerStyle: {
    backgroundColor: Colors.button_background_primary,
    marginVertical: 5,
    borderRadius: 5,
    padding: 8,    
  },
  listTextStyle: {
    color: Colors.button_text_primary,
    textAlign: 'center',
  },
};

export default RulesModal;
