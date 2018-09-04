import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { connect } from 'react-redux';

const noNotificationsImage = require('../images/ic_notifications.png');

class NotificationBadge extends Component {

	render() {
		if (this.props.newNotifications === '0') {
			return (
				<TouchableOpacity
					style={{ padding: 10 }}
					onPress={() => this.props.navigation.state.params.handleNotifications()}
				>
					<Image
						source={noNotificationsImage}
						style={{ height: 24, width: 24 }}
					/>
				</TouchableOpacity>
			);
		}

		const badgeWidth = 20 + (this.props.newNotifications.length * 10);

		return (
			<TouchableOpacity
				style={{ padding: 10 }}
				onPress={() => this.props.navigation.state.params.handleNotifications()}
			>
				<View
					style={{
						backgroundColor: 'rgba(255,90,90,1)',
						width: badgeWidth,
						height: 30,
						paddingBottom: 3,
						borderRadius: 15,
						justifyContent: 'center',
						alignItems: 'center',
						borderColor: 'rgba(255,255,255,0.5)',
						borderWidth: 2,
					}}
				>
					<Text
						style={{
							alignSelf: 'center', 
							fontSize: 18, 
							color: 'white', 
							fontWeight: 'bold', 
							backgroundColor: 'transparent',
							paddingTop: 1
						}}
					>
						{this.props.newNotifications}
					</Text>
				</View>
			</TouchableOpacity>
		);
  }
}

const mapStateToProps = (state) => {
	let newNotificationsCount = state.notifications
		.filter((notification) => notification.Read === false).length;

	if (newNotificationsCount > 99) {
		newNotificationsCount = '+99';
	} else {
		newNotificationsCount = `${newNotificationsCount}`;
	}

	return {
		newNotifications: newNotificationsCount
	};
};

export default connect(mapStateToProps)(NotificationBadge);
