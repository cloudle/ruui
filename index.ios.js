import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './example/legacy';
import configureStore from './example/legacy/store';

const store = configureStore();
function appWithStore() {
	return <App store={store}/>;
}

AppRegistry.registerComponent('ruui', () => appWithStore);