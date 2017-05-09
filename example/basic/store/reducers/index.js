import { combineReducers } from 'redux';

import appReducer from './app';
import { initialRoute } from '../../utils';

export default combineReducers({
	app: appReducer,
});