// Import libraries to help create a component
import React from 'react';
import { TouchableOpacity, Text, Image, View, Dimensions } from 'react-native';
import Colors from '../constants/Color';

const reclaimImage = require('../images/reclaim_icon.png');
const { width } = Dimensions.get('window');

// Make a component
const ReclaimButton = ({ onPress, points, missing }) => {
  const { buttonStyle, notEnoughButtonStyle } = styles;

  const deviceWidth = Dimensions.get('window').width - 80;
  const fontSize = deviceWidth / 15;

  if (missing > 0) {
    return (
      <View onPress={onPress} style={notEnoughButtonStyle}>
        <View
          style={{
            flex: 4,
            borderRightWidth: 1,
            borderColor: '#ddd',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <Text
            style={{
              fontSize: fontSize,
              color: '#aaa',
              fontWeight: '600',
              marginLeft: 20,
              lineHeight: 24
            }}
          >
            Faltam {missing} pontos
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderLeftWidth: 1,
            borderColor: '#ddd',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <Text
            style={{
              fontSize: fontSize,
              color: '#aaa',
              fontWeight: '600',
              lineHeight: 24
            }}
          >
            {points}
          </Text>
          <Text
            style={{
              marginLeft: 5,
              lineHeight: 24,
              fontSize: 16,
              color: '#aaa',
              fontWeight: '600'
            }}
          >
            pts
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View
        style={{
          flex: 4,
          borderRightWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <Image
          source={reclaimImage}
          style={{
            width: 24,
            height: 24,            
          }}
        />
        <Text
          style={{
            fontSize: fontSize,
            color: Colors.button_text_primary,
            fontWeight: '600',
            marginLeft: 20,
            lineHeight: 24
          }}
        >
          Obter recompensa
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          borderLeftWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <Text
          style={{
            fontSize: fontSize,
            color: Colors.button_text_primary,
            fontWeight: '600',
            lineHeight: 24
          }}
        >
          {points}
        </Text>
        <Text
          style={{
            marginLeft: 5,
            lineHeight: 24,
            fontSize: 16,
            color: Colors.points_view_basetext,
            fontWeight: '600'
          }}
        >
          pts
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.button_background_primary,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 10,
    borderColor: Colors.button_background_primary
  },
  notEnoughButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 10,
    borderColor: '#aaa'
  }
};

// Make the component available to other parts of the app
export default ReclaimButton;
