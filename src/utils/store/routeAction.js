import * as Actions from './actions';

export function push(key, params = {}) {
	return { type: Actions.RouterPush, key, params };
}

export function replace(key, params = {}) {
	return { type: Actions.RouterReplace, key, params };
}

export function pop(params = {}) {
	return { type: Actions.RouterPop, params };
}

export function reset(key, params = {}) {
	return { type: Actions.RouterReset, key, params };
}