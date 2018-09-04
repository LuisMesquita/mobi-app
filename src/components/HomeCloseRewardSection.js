import React, { Component } from 'react';

import { Section } from './common';
import HomeCloseRewardList from './HomeCloseRewardList';

class HomeCloseRewardSection extends Component {
	render() {		
		if (this.props.rewards.length > 0) {
			return (
				<Section
					header='Quase lá!'
					subHeader='Falta pouco para você adquirir estes prêmios.'
				>
					<HomeCloseRewardList rewards={this.props.rewards} />
				</Section>
			);
		}

		return null;
	}
}

export default HomeCloseRewardSection;
