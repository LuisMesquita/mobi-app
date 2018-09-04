import {
	GoogleAnalyticsTracker,
	GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

import Constants from '../constants/Constants';

export const ANALYTICS_EVENTS_TYPES = {
	BUTTON_TAP: {
		category: 'ui_action',
		action: 'button_tap'
	},
	PULL_TO_REFRESH: {
		category: 'ui_action',
		action: 'pull_to_refresh'
	},


	ACTION_SUCCESS: {
		category: 'action_response',
		action: 'action_success'
	},
	ACTION_FAILURE: {
		category: 'action_response',
		action: 'action_failure'
	},
	ACTION_CANCELED: {
		category: 'action_response',
		action: 'action_canceled'
	}
};


let sharedInstance = null;

export class MobiAnalytics {
	
	// Config and initialization methods
	static shared() {
		if (sharedInstance === null) {
			sharedInstance = new MobiAnalytics();
		}

		return sharedInstance;
	}

	initUser(userId) {
		this.tracker.setUser(userId);
	}

	config() {
		this.tracker = new GoogleAnalyticsTracker(Constants.analyticsTrackerId);
		this.tracker.setAppName(Constants.analyticsAppName);

		this.tracker.allowIDFA(false);
	}

	toggleDevEnv(isDevEnv = true) {
		GoogleAnalyticsSettings.setDryRun(isDevEnv);
	}

	// Tracking methods
	trackScreen(screenName) {
		console.log('AnalyticsTrack screen', screenName);
		this.tracker.trackScreenView(screenName);
	}

	trackEvent(eventType, label, value) {
		console.log('AnalyticsTrack event', label, value);
		this.tracker.trackEvent(
			eventType.category,
			eventType.action,
			{ label, value }
		);
	}

}
