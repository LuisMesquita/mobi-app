import React, { Component } from 'react';
import { TextInput, View, Image, Text} from 'react-native';
import Colors from '../../constants/Color';

const validationOk = require('../../images/ic_done.png');
const validationFalse = require('../../images/excluir.png');

class UserInputValidation extends Component {

  renderValidationResult(validation) {    
    if (validation) {
      return (<Image
        source={validationOk}
        style={[styles.iconStyle,styles.green]}
      />);
    }else if(!validation && validation != null) {
      return (<Image
        source={validationFalse}
        style={[styles.iconStyle,styles.red]}
      />);
    }
  }

	render() {
		return (
      <View style={{ marginBottom: 10, justifyContent: 'center', position: 'relative' }}>
        <TextInput
          style={this.props.style ? this.props.style : styles.inputStyle}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor='#4C606B'
          underlineColorAndroid='transparent'
          onChangeText={this.props.onChangeText}
          value={this.props.value}
        />
        {this.renderValidationResult(this.props.validation)}
        {this.props.error ? <Text style={this.props.errorStyle ? this.props.errorStyle : styles.errorStyle}>{this.props.error}</Text> : null}
      </View>
		);
	}
}

const styles = {
	inputStyle: {
		backgroundColor: 'rgba(255, 255, 255, 1)',
		height: 40,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 4,
		color: '#4C606B',
		alignSelf: 'stretch',
    borderColor: Colors.primary,
    borderWidth: 1
	},
  errorStyle: {
    color: 'red',
  },
  red: {
    tintColor: 'red'
  },
  green: {
    tintColor: 'green'
  },
  iconStyle: {
    position: 'absolute',    
    right: 5,
    height: 24,
    top: 8,
    width: 24,
	}
};

export { UserInputValidation };
