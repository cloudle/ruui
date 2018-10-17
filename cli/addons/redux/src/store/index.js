import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { ruuiMiddleware } from 'react-universal-ui';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const DEVTOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
	composeEnhancers = global[DEVTOOLS] || compose,
	loggerIncludes = new Set([
		// actions.ExplorerSyncObjects,
	]),
	logger = createLogger({
		predicate: (getState, action) => {
			return true; //loggerIncludes.has(action.type);
		},
	});

export default function configureStore(initialState) {
	const enhancers = composeEnhancers(
		applyMiddleware(logger),
		applyMiddleware(ruuiMiddleware()),
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

export const store = configureStore();