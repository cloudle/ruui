import { combineReducers } from 'redux';
import { ruuiReducer } from '../../../../dist';

import appReducer from './app';

export default combineReducers({
	app: appReducer,
	ruui: ruuiReducer,
});
