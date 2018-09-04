import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/Color';

const Section = ({ children, header, subHeader, style }) => {
	const {
		sectionContainerStyle,
		headerStyle,
		subHeaderStyle
	} = styles;

	return (
		<View style={[sectionContainerStyle, style]}>
			<Text style={headerStyle}>
				{header}
			</Text>

			<Text style={subHeaderStyle}>
				{subHeader}
			</Text>

			{children}
		</View>
	);
};

const styles = {
	sectionContainerStyle: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	headerStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.text_title,
		marginHorizontal: 20,
	},
	subHeaderStyle: {
		fontSize: 14,
		color: '#bbb',
		marginHorizontal: 20,
		marginBottom: 15
	}
};

export { Section };
