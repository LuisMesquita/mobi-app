import React, { Component } from 'react';
import {
	View,
	Image,
} from 'react-native';
import LogoImg from '../images/brand.png';

class Logo extends Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={{ flex: 1 }} />
				<View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
					<Image source={LogoImg} style={styles.image} resizeMode='contain' />
				</View>
				<View style={{ flex: 1 }} />
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 50
	},
	image: {
		flex: 1,
		width: 600,
		height: 140,
		resizeMode: 'contain'
	}
};

export default Logo;
