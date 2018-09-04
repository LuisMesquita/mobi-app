import React, { Component } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

const cameraImage = require('../images/ic_camera.png');

const SQUARE_SIDE = 100;

class ProfileEditImage extends Component {
	render() {
		return (
			<TouchableOpacity
				onPress={() => this.props.changePicture()}
			>
			<View style={styles.container}>
				<Image
					source={{ uri: this.props.imageUrl }}
					style={styles.image}
					blurRadius={0.4}
				/>
				<Image source={cameraImage} style={styles.overlay} />
			</View>
			</TouchableOpacity>
		);
	}
}

const styles = {
	container: {
		height: SQUARE_SIDE,
		width: SQUARE_SIDE,
		alignSelf: 'center'
	},
	image: {
		width: SQUARE_SIDE,
		height: SQUARE_SIDE,
		borderRadius: SQUARE_SIDE / 2,
	},
	overlay: {
		width: (SQUARE_SIDE * 3) / 5,
		height: (SQUARE_SIDE * 3) / 5,
		tintColor: 'white',
		position: 'absolute',
		top: SQUARE_SIDE / 5,
		bottom: SQUARE_SIDE / 5,
		left: SQUARE_SIDE / 5,
		right: SQUARE_SIDE / 5
	}
};

export default ProfileEditImage;
