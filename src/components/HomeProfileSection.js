import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PointsView, RoundImage } from './common';
import Colors from '../constants/Color';

class HomeProfileSection extends Component {
	openExtract() {
		console.log('clicado')
	}

	render() {
		const { name, CPF, points, imageUrl, onClickHandler } = this.props;

		const {
			sectionContainerStyle,
			profileInfoContainer,
			profileImgStyle,
			personalInfoStyle,
			profileNameStyle,
			profileIdStyle
		} = styles;

		return (			
			<View style={sectionContainerStyle}>
				<View style={profileInfoContainer}>
					<RoundImage
						source={{ uri: imageUrl }}
						size={50}
						style={profileImgStyle}
					/>
					<View style={personalInfoStyle}>
						<Text numberOfLines={1} style={profileNameStyle}>{name}</Text>
						<Text style={profileIdStyle}>{CPF}</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={onClickHandler}					
				>
					<PointsView
						points={points}
						backgroundColor={Colors.points_view_background}
						borderColor={Colors.points_view_text}
						textColor='#fff'
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = {
	sectionContainerStyle: {
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	profileInfoContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		width: '50%',
		alignSelf: 'center',
	},
	profileImgStyle: {
		// marginRight: 10,
	},
	personalInfoStyle: {
		marginLeft: 10,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	profileNameStyle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.text_title
	},
	profileIdStyle: {
		fontSize: 14,
		color: '#bbb'
	}
};

export default HomeProfileSection;
