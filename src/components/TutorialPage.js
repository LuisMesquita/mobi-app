import React from 'react';
import { View, Text, Image } from 'react-native';

import Colors from '../constants/Color';

const TutorialPage = ({ image, pageTitle, description }) => {
  const {
    containerStyle,
    imageStyle,
    titleStyle,
    descStyle,
    textContainerStyle,
    imageContainerStyle
  } = styles;

  return (
    <View style={containerStyle}>
      <View style={{ alignItems: 'center' }}>        
        <Image
          source={image}
          style={imageStyle}          
        />
        <View style={textContainerStyle}>
          <Text style={titleStyle}>{pageTitle}</Text>
          <Text style={descStyle}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    height: '100%',    
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',   

  },
  textContainerStyle: {
    flex: 1,    
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  imageStyle: {    
    flex: 1.5,
    resizeMode: 'contain'  
  },  
  titleStyle: {
    color: Colors.start_title_text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',

    marginBottom: 15
  },
  descStyle: {
    color: '#B3B3B3',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20
  }
};

export default TutorialPage;
