import 'babel-polyfill';
import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage } from 'react-native';
import app from './example/travel';
import configureStore from './example/travel/store';

import { AppContainer } from 'react-hot-loader';

const store = configureStore();
render = Component => {
	const rootEl = document.getElementById('root');

	ReactNative.render(
		<AppContainer>
			<Component store={store}/>
		</AppContainer>,
		rootEl
	);
};

render(app);

if(module.hot) {
	module.hot.accept('./example/travel', () => {
		const nextApp = require('./example/travel').default;
		render(nextApp);
	});
}