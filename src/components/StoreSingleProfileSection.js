import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { PointsView, RoundImage } from './common';
import Colors from '../constants/Color';

class StoreSingleProfileSection extends Component {
	render() {
		const { profileImageUrl, name, CPF, currentPoints } = this.props;
		
		return (
			<View style={styles.sectionContainerStyle}>
				<View style={{flex:3,flexDirection: 'row',alignItems: 'center'}}>
					<RoundImage
						source={{ uri: profileImageUrl }}
						size={50}						
					/>
					<View style={styles.personalInfoStyle}>
						<Text numberOfLines={1} style={styles.profileNameStyle}>{name}</Text>
						<Text style={styles.profileIdStyle}>{CPF}</Text>
					</View>
				</View>
				<PointsView
					points={currentPoints}
					backgroundColor='white'
					borderColor='#ddd'
					textColor={Colors.primary}
					style={{flex: 1}}
				/>
			</View>
		);
	}
}

const styles = {
	sectionContainerStyle: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#ddd'
	},
	personalInfoStyle: {
		marginLeft: 10,
		width: '70%'
	},
	profileNameStyle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.text_title,
	},
	profileIdStyle: {
		fontSize: 14,
		color: '#bbb'
	}
};

export default StoreSingleProfileSection;
