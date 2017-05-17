import * as Actions from './actions';

export function push(route) {
	return { type: Actions.RouterPush, route };
}

export function pop() {
	return { type: Actions.RouterPop };
}

export function reset() {
	return { type: Actions.NativeRouterReset };
}

export function jumpTo(key: String) {
	return { type: Actions.RouterJumpTo, key };
}

export function jupToIndex(index: Number) {
	return { type: Actions.NativeRouterJumpToIndex, index };
}