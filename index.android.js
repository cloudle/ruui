import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './example/travel';
import configureStore from './example/travel/store';

const store = configureStore();
function appWithStore () {
	return <App store={store}/>
}

AppRegistry.registerComponent('ruui', () => appWithStore);