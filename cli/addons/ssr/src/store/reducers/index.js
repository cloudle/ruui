import { combineReducers } from 'redux';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { utils } from 'react-universal-ui';
import appReducer from './app';
import { connectRouter } from 'connected-react-router';

export const history = utils.isServer ? createMemoryHistory() : createBrowserHistory();

export default combineReducers({
	app: appReducer,
	router: connectRouter(history),
});
