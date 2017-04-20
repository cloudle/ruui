import * as Actions from './actions';

export function toggleSelector(flag, configs = {}) {
	return { type: Actions.ToggleSelect, flag, configs };
}

export function toggleModal(flag, configs = {}) {
	return { type: Actions.ToggleModal, flag, configs };
}

export function toggleLoading(flag, configs = {}) {
	return { type: Actions.ToggleLoading, flag, configs };
}