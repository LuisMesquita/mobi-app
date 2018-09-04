import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Linking } from 'react-native';

import store from './store';
import RootComponent from './RootComponent'
import LinkRoutes from './LinkRoutes';

import { MobiAnalytics } from './helpers/Analytics';

class App extends Component<{}> {

  componentDidMount() {
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    Linking.getInitialURL().then(url => url && this.handleOpenURL(url));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  componentWillMount() {
        MobiAnalytics.shared().config();
        // Do not log events on GA dashboard if on dev mode:
        // MobiAnalytics.shared().toggleDevEnv(__DEV__);
    }

  render() {    
    return (
      <Provider store={store}>
        <RootComponent />
      </Provider>
    );
  }
}

export default App;
