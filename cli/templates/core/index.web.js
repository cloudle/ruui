import React from 'react';
import { AppRegistry } from 'react-native';
import { AppContainer } from 'react-hot-loader';
import app from './src';

const renderApp = (Component) => {
	const App = () => {
		return <AppContainer>
			<Component/>
		</AppContainer>;
	};

	AppRegistry.registerComponent('App', () => App);
	AppRegistry.runApplication('App', {
		initialProps: {},
		rootTag: document.getElementById('root'),
	});
};

renderApp(app);

if (module.hot) {
	module.hot.accept('./src', () => {
		const nextApp = require('./src').default;
		renderApp(nextApp);
	});
}