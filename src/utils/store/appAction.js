import * as Actions from './actions';

export function toggleSelector (flag, configs = {}) {
	return { type: Actions.ToggleSelect, flag };
}