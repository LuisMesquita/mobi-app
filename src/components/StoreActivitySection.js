import React, { Component } from 'react';
import { View, Text } from 'react-native';

import StoreList from './StoreList';
import Colors from '../constants/Color';

class StoreActivitySection extends Component {
	render() {
		const { header, franchise, storeList, favorite, onClickHandler, filter } = this.props;
		const { sectionContainerStyle, headerStyle } = styles;
		// console.log('StoreActivitySection_props', this.props);

		if (favorite && storeList) {
			const favoriteList = storeList.filter((store) => store.Favorited);

			if (favoriteList.length === 0) {
				return null;
			}
		}

		return (
			<View style={sectionContainerStyle}>
				<Text style={headerStyle}>{header}</Text>
				<StoreList
					franchise={franchise}
					storeList={storeList}
					favorite={favorite}
					filter={filter}
					onClickHandler={onClickHandler}
				/>
			</View>
		);
	}
}

const styles = {
	sectionContainerStyle: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	headerStyle: {
		fontSize: 20,
		marginHorizontal: 18,
		marginTop: 10,
		marginBottom: 15,
		fontWeight: 'bold',
		color: Colors.text_title,
	},
};

export default StoreActivitySection;
