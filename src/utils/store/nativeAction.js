import * as Actions from './actions';

export function push (route) {
	return { type: Actions.NativeRouterPush, route };
}

export function pop () {
	return { type: Actions.NativeRouterPop };
}

export function reset () {
	return { type: Actions.NativeRouterReset };
}

export function jumpTo (key: String) {
	return { type: Actions.NativeRouterJumpTo, key };
}

export function jupToIndex (index: Number) {
	return { type: Actions.NativeRouterJumpToIndex, index };
}