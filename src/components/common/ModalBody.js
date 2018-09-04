import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

import { Section, Button } from '../common';
import Colors from '../../constants/Color';

const backImage = require('../../images/excluir.png');

class ModalBody extends Component {    
  
render(){
    const { 
      onBackPress, 
      header, 
      subHeader, 
      children
    } = this.props

    const {
      containerStyle,
      textStyle,
      pointsStyle,
      thumbnailStyle,
      headerStyle,
      subHeaderStyle,
      backButton
    } = styles;    
 
    return (
      <View      
        style={containerStyle}  
      >     
      <View        
      >            
        <TouchableOpacity 
          style={backButton}
          onPress={onBackPress}
        >  
          <Image
            style={{
              width: 30,              
              height: 30,                                            
              tintColor: Colors.gray_medium
            }}
            source={backImage}
          />
        </TouchableOpacity>            

        <Text style={headerStyle}>
          {header}
        </Text>

        <Text style={subHeaderStyle}>
          {subHeader}
        </Text>

          {children}
      </View>
      </View>
    );
  }
}

const styles = {  
    containerStyle: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignContent: 'center',
      marginTop: 20,
      padding: 10,
      backgroundColor: Colors.secondary_container_background,
      borderRadius: 5,
      flex: 1,
    },
    headerStyle: {
      fontSize: 25,
      fontWeight: 'bold',
      color: Colors.primary,      
      marginBottom: 15, 
      textAlign: 'center',      
    },
    subHeaderStyle: {
      fontSize: 17,
      color: '#bbb',      
      marginBottom: 15,      
      textAlign: 'center',
      color: Colors.gray_dark,
    }
  };

export { ModalBody };
