// Import libraries to help create a component
import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../constants/Color';

const RewardFAQ = () => {  
  const { yellowCircleStyle, listTextStyle } = styles;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 20,        
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors.primary,
          marginBottom: 10
        }}
      >
        Como resgatar:
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={yellowCircleStyle} />
        <Text style={listTextStyle}>
          {'Informe ao atendente que você possui uma recompensa.'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={yellowCircleStyle} />
          <Text style={listTextStyle}>
          {'Mostre o código de resgate em seu celular.'}
        </Text>
      </View>      
    </View>
  );
};

const styles = {
	yellowCircleStyle: {
		width: 8,
		height: 8,
		borderRadius: 4,
    marginTop: 7,
		backgroundColor: '#E8C252'
	},
	listTextStyle: {
		marginLeft: 5,
		color: '#888',
		lineHeight: 24,
    textAlignVertical: 'top',
	}
};

export default RewardFAQ;
