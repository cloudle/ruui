import * as Actions from './actions';
import { uuid } from '../helpers';

export function resetState() {
	return { type: Actions.ResetState, };
}

export function updateThemeConfigs(configs = {}) {
	return { type: Actions.UpdateThemeConfigs, configs };
}

export function updateScreenInfo(info = {}) {
	return { type: Actions.UpdateScreenInfo, info };
}

export function updateNetInfo(info = {}) {
	return { type: Actions.UpdateNetInfo, info };
}

export function toggleSelector(flag, configs = {}) {
	return { type: Actions.ToggleSelect, flag, configs };
}

export function toggleModal(flag, configs = {}) {
	return { type: Actions.ToggleModal, flag, configs };
}

export function toggleLoading(flag, configs = {}) {
	return { type: Actions.ToggleLoading, flag, configs };
}

export function insertSnackBar(configs = {}) {
	return { type: Actions.InsertSnackBar, configs: {
		...configs, id: configs.id || uuid(),
	} };
}

export function startDestroySnackBar(configs = {}) {
	return { type: Actions.StartDestroySnackBar, configs };
}

export function destroySnackBar(configs = {}) {
	return { type: Actions.DestroySnackBar, configs };
}