import 'babel-polyfill';
import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage } from 'react-native';
import wings from './src/app';

import { AppContainer } from 'react-hot-loader';

render = Component => {
	const rootEl = document.getElementById('root');

	ReactNative.render(
		<AppContainer>
			<Component/>
		</AppContainer>,
		rootEl
	);
};

render(wings);

if(module.hot) {
	module.hot.accept('./src/app', () => {
		const nextApp = require('./src/app').default;
		render(nextApp);
	});
}