import React, { Component } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';

import Colors from '../../constants/Color';

class LoadingImage extends Component {
	
	state = {
		isLoading: true,
		// hasError: false
	}

	/*onError(error) {
		console.log('error loading image', error);
		this.setState({ hasError: true });
	}*/

	onLoad() {
		this.setState({ isLoading: false, hasError: false });
	}

	renderLoading() {
		if (!this.state.isLoading) {
			return;
		}

		return (
			<View
				style={styles.loadingContainerStyle}
			>
				<ActivityIndicator
					style={{ flex: 1 }}
					size={this.props.loadingSize || 'small'}
					color={Colors.loading_indicator}
				/>
			</View>
		);
	}

	renderImage = (sourceUri, resizeMode) => {
		// const source = this.state.hasError ? placeholderImage : { uri: sourceUri };
		const source = { uri: sourceUri };

		return (
			<Image
				style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
				onLoad={this.onLoad.bind(this)}
				// onError={this.onError.bind(this)}
				source={source}
				resizeMode={resizeMode || 'cover'}
			/>
		);
	}

	render() {
		const {
			style,
			sourceUri,
			resizeMode,
			borderRadius = 0,
			hasShadow = true,
		} = this.props;

		let shadowContainerStyle = {};
		if (hasShadow) {
			shadowContainerStyle = { ...styles.shadowContainerStyle, shadowRadius: borderRadius };
		}

		return (
			<View style={{ ...shadowContainerStyle, ...style }}>
				<View style={{ ...styles.containerStyle, borderRadius }}>
					{this.renderLoading()}
					
					{this.renderImage(sourceUri, resizeMode)}

				</View>
			</View>
		);
	}
}

const styles = {
	loadingContainerStyle: { 
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		zIndex: 999,
	},
	containerStyle: {
		backgroundColor: 'transparent',
		overflow: 'hidden',
		height: '100%',
		width: '100%'
	},
	shadowContainerStyle: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,

		backgroundColor: 'transparent'
	}
};

export { LoadingImage };
