import { createStore, compose, applyMiddleware } from 'redux';
import { ruuiMiddleware, createRuuiStore, } from '../../../dist';
import * as Actions from './actions';

import reducers from './reducers';

const DEVTOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
	composeEnhancers = module.hot && (window[DEVTOOLS] || compose);

export const ruuiStore = createRuuiStore();

export function configureStore(initialState) {
	const enhancers = composeEnhancers(
		applyMiddleware(ruuiMiddleware(ruuiStore))
	);

	const store = initialState
		? createStore(reducers, initialState, enhancers)
		: createStore(reducers, enhancers);

	return store;
}

const store = configureStore();
export default store;
