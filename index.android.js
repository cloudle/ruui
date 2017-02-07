import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './example';
import configureStore from './example/store';

const store = configureStore();
function appWithStore () {
	return <App store={store}/>
}

AppRegistry.registerComponent('ruui', () => appWithStore);