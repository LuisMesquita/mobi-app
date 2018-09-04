import React, { Component } from 'react';
import {
	TextInput
} from 'react-native';

class UserInput extends Component {
	render() {
		const {
			placeholder,
			secureTextEntry,
			autoCorrect,
			autoCapitalize,
			returnKeyType,
			onChangeText,
			keyboardType
		} = this.props;

		return (
			<TextInput
				style={styles.inputStyle}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				autoCorrect={autoCorrect}
				autoCapitalize={autoCapitalize}
				returnKeyType={returnKeyType}
				placeholderTextColor='#4C606B'
				underlineColorAndroid='transparent'
				onChangeText={onChangeText}
				keyboardType={keyboardType}
			/>
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
		marginBottom: 10,
		color: '#4C606B',
		alignSelf: 'stretch',
	}
};

export { UserInput };
