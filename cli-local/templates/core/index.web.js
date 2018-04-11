import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import app from './src';
import { store } from './src/store';
import * as appActions from './src/store/action/app';

const renderApp = (Component) => {
	render(<AppContainer>
		<Component/>
	</AppContainer>, document.getElementById('root'));
};

renderApp(app);

if (module.hot) {
	module.hot.accept('./src', () => {
		const nextApp = require('./src').default;
		renderApp(nextApp);

		/* Beautiful workaround:
		 Force update unrelated modules in the next execution loop. */
		setTimeout(() => store.dispatch(appActions.increaseCounter()), 0);
	});
}