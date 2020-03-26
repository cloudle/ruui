import { combineReducers } from 'redux';
import { utils } from 'react-universal-ui';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import appReducer from './app';

export const history = utils.isServer ? createMemoryHistory() : createBrowserHistory();

export default combineReducers({
	app: appReducer,
	router: connectRouter(history),
});
