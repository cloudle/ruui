import { combineReducers } from 'redux';

import appReducer from './app';
import routerReducer from './router';

export default combineReducers({
	app: appReducer,
	router: routerReducer,
});