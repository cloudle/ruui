import { AppRegistry } from 'react-native';
import App from './app.hot';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
	initialProps: {},
	rootTag: document.getElementById('root'),
});
