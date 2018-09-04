import Path from 'path-parser';
import { NavigationActions } from 'react-navigation';
import store from './store';

const paths = [
  {
    routeName: 'YourScreenRoute',
    path: new Path('/base/path/:paramA/:paramB'),
  },
];

const findPath = url => paths.find(path => path.path.test(url));

export default url => {
  const pathObject = findPath(url);
  
  if (!pathObject) return;

  const navigateAction = NavigationActions.navigate({
    routeName: pathObject.routeName,
    params: pathObject.path.test(url),
  });

  store.dispatch(navigateAction);
};
