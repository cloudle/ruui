import * as Actions from './actions';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { isBrowser } from '../../utils';

export let history = isBrowser ?
	createBrowserHistory() : createMemoryHistory();

export function browserRouteReducer (reducer: Reducer) {
	const initialState = {
		location: history.location,
		action: history.action,
		...reducer(undefined, { type: Actions.ReduxInit }),
	};

	return function (state = initialState, action) {
		switch (action.type) {
			case Actions.BrowserRouterNavigate:
				return {
					...state,
					location: action.location,
					action:  action.action,
				};
			default:
				return reducer(state, action);
		}
	}
}