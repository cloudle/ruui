import { combineReducers } from 'redux';
import { ruuiReducer } from '../../../../src';

import appReducer from './app';

export default combineReducers({
	app: appReducer,
	ruui: ruuiReducer,
});
