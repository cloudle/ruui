import { combineReducers } from 'redux';

import appReducer from './app';
import { routeReducer } from '../../../../src';
import routeConfigs from '../../routes';

const initialRouterState = {

};

const routerReducer = routeReducer(
	routeConfigs,
	(state = initialRouterState, action) => {
		switch (action.type) {
		default:
			return state;
		}
	}
);

export default combineReducers({
	app: appReducer,
	router: routerReducer,
});