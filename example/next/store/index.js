import { createStore, compose, applyMiddleware } from 'redux';
import { ruuiMiddleware } from '../../../src';
import * as Actions from './actions';

import reducers from './reducers';

const DEVTOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
	composeEnhancers = module.hot && (window[DEVTOOLS] || compose);

export function configureStore(initialState) {
	const enhancers = composeEnhancers(
		applyMiddleware(ruuiMiddleware())
	);

	const store = initialState
		? createStore(reducers, initialState, enhancers)
		: createStore(reducers, enhancers);

	if (module.hot) {
		module.hot.accept('./reducers', () => {
			const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}

const store = configureStore();
export default store;