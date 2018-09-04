// Import libraries to help create a component
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Colors from '../../constants/Color';

// Make a component
const Button = ({ onPress, children, buttonColor, textColor, style, disabled }) => {
  const { baseButtonStyle, baseTextStyle } = styles;

  const buttonStyle = Object.assign({}, baseButtonStyle);
  buttonStyle.backgroundColor = buttonColor;
  buttonStyle.borderColor = buttonColor;
  
  const textStyle = Object.assign({}, baseTextStyle);
  textStyle.color = textColor;  

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...buttonStyle, ...style }}
      disabled={disabled}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  baseButtonStyle: {
    alignSelf: 'stretch',    
    borderWidth: 2,
    borderRadius: 5,    
  },
  baseTextStyle: {
    alignSelf: 'center',    
    fontSize: 16,
    fontWeight: '600',    
    paddingTop: 10,
    paddingBottom: 10
  }
};

// Make the component available to other parts of the app
export { Button };
