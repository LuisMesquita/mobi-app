import { StackNavigator } from 'react-navigation';

import StartContainer from './containers/StartContainer';
import SignUpContainer from './containers/SignUpContainer';
import LoginContainer from './containers/LoginContainer';
import MainContainer from './containers/MainContainer';
import RecoverContainer from './containers/RecoverContainer';
import LoadingContainer from './containers/LoadingContainer';
import NotificationsContainer from './containers/NotificationsContainer';
import NotificationSingleContainer from './containers/NotificationSingleContainer';
import WarningModal from './modals/WarningModal';

import Colors from './constants/Color';

const RootNavigator = StackNavigator({
  Loading: {
    screen: LoadingContainer,
  },
  Start: {
    screen: StartContainer,
  },
  SignUp: {
    screen: SignUpContainer,
  },
  Login: {
    screen: LoginContainer,
  },
  Recover: {
    screen: RecoverContainer,
  },
  Main: {
    screen: MainContainer,
  },
  Warning: {
    screen: WarningModal,
  },
  Notifications: {
    screen: NotificationsContainer,
  },
  SingleNotification: {
    screen: NotificationSingleContainer,
  }
}, {
	navigationOptions: {	
    initialRouteName: 'Loading',	
    headerStyle: {
      backgroundColor: Colors.header_background,            
    },
    headerTitleStyle: {                     
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },      
		headerTintColor: 'white',
    headerBackTitle: null,
    mode: 'card'
  }
});

export default RootNavigator;
