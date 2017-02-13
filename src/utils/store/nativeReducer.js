import * as Actions from './actions';
import StateUtils from '../../components/NavigationExperimental/NavigationStateUtils';

export function nativeRouteReducer (reducer: Reducer) {
	const initialState = {
			index: 0,
			routes: [],
			...reducer(undefined, { type: Actions.ReduxInit })
		};

	return function (state = initialState, action) {
		switch (action.type) {
			case Actions.NativeRouterPush:
				return StateUtils.push(state, action.route);
			case Actions.NativeRouterPop:
				return StateUtils.pop(state);
			case Actions.NativeRouterReset:
				return StateUtils.reset(state);
			case Actions.NativeRouterJumpTo:
				return StateUtils.jumpTo(state, action.key);
			case Actions.NativeRouterJumpToIndex:
				return StateUtils.jumpToIndex(state, action.index);
			default:
				return reducer(state, action);
		}
	}
}