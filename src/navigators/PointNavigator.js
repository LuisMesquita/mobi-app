import { StackNavigator } from 'react-navigation';

import PointCamera from '../components/PointCamera';
import PointCode from '../components/PointCode';
import Colors from '../constants/Color';

const PointNavigator = StackNavigator(
{
  Camera: {
    screen: PointCamera
  },
  Code: {
    screen: PointCode,
  }
}, {
  headerMode: 'float',
	navigationOptions: {      
	headerStyle: {
		backgroundColor: Colors.header_background,		
		elevation: 4,		    
	},
  headerTitleStyle: {                     
      fontSize: 20,
      fontWeight: 'bold',            
    },       
	headerTintColor: 'white',
    headerBackTitle: null
  },
});


       
export default PointNavigator;
