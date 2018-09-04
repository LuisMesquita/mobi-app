import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';

import Colors from '../../constants/Color';

const arrowLeftImage = require('../../images/arrow_left_3x.png');


class BackButton extends Component {
	render() {
		return (
			<TouchableOpacity onPress={this.props.onPress} style={{ zIndex: 9999 }}>
				<Image
					style={{
						width: 40,
						height: 40,
						position: 'absolute',
						top: 60,
						left: 10,
						tintColor: Colors.start_title_text
					}}
					source={arrowLeftImage}
				/>
			</TouchableOpacity>
		);
	}
}

export { BackButton };
