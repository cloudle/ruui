import * as Actions from './actions';

export function routeReducer(reducer) {
	const initialState = {
		index: 0,
		routes: [],
		...reducer(undefined, { type: Actions.ReduxInit }),
	};

	return function (state = initialState, action) {
		switch (action.type) {
		case Actions.RouterPush:
			return {
				...state,
				routes: [...state.routes, action.route],
				index: state.routes.length,
			};
		case Actions.RouterPop:
			return {
				...state,
				routes: state.routes.slice(0, state.routes.length - 1),
				index: state.routes.length - 2,
			};
		case Actions.RouterJumpTo:
			return reducer(state, action);
		default:
			return reducer(state, action);
		}
	};
}