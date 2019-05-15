import { createStore } from '../utils/ruuiStore';
import appReducer, { initialState } from './appReducer';
import * as appActions from './action/app';
import * as actions from './actions';

export const ruuiReducer = (state = initialState, action) => {
	switch (action.type) {
	case actions.ReduxSync:
		return action.state;
	default:
		return state;
	}
};

export const ruuiMiddleware = (ruuiStore) => {
	return (reduxStore) => {
		let reduxState = reduxStore.getState();
		if (reduxState.toJS) reduxState = reduxState.toJS(); /* <- support Immutable state */

		if (reduxState.ruui) {
			ruuiStore.subscribe(() => {
				reduxStore.dispatch(appActions.reduxSync(ruuiStore.getState()));
			});
		}

		return next => (action) => {
			if (action.type !== actions.ReduxSync) {
				ruuiStore.dispatch(action);
			}

			next(action);
		};
	};
};
