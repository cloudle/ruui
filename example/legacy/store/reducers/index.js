import { combineReducers } from 'redux';

import appReducer from './app';
import { utils } from '../../../../src';
import { initialRoute } from '../../utils';

const initialRouterState = {
	routes: [initialRoute],
};

const routeReducer = utils.routeReducer(
	(state = initialRouterState, action) => {
		switch (action.type) {
		default:
			return state;
		}
	}
);

export default combineReducers({
	app: appReducer,
	router: routeReducer,
});