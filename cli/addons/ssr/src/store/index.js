import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { ruuiMiddleware, createRuuiStore } from 'react-universal-ui';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import reducers, { history } from './reducers';

export const ruuiStore = createRuuiStore();

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
		applyMiddleware(
			logger,
			routerMiddleware(history),
			ruuiMiddleware(ruuiStore),
		),
	);

	const store = initialState
		? createStore(reducers, initialState, enhancers)
		: createStore(reducers, enhancers);

	return store;
}

export const appStore = configureStore();
