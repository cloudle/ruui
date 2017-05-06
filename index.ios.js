import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './example/next';
import configureStore from './example/next/store';

const store = configureStore();
function appWithStore () {
	return <App store={store}/>
}

AppRegistry.registerComponent('ruui', () => appWithStore);