import store from '../store';

let rootNavigation = null;
store.subscribe(() => {
  rootNavigation = store.getState().helper.rootNavigation;  
});

export const showBlockingWarning = (errorData) => {  
	console.log(store.getState())
	rootNavigation.navigate({ routeName: 'Warning', params: { warning: errorData }}); 
}