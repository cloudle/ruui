import * as Actions from './actions';

export function toggleSelect (flag) {
	return { type: Actions.ToggleSelect, flag };
}