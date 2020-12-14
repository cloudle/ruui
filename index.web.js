import 'setimmediate'

if (!global.setImmediate) {
	global.setImmediate = setTimeout
}

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './examples/next';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
	initialProps: {},
	rootTag: document.getElementById('root'),
});
