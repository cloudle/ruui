import * as Actions from './actions';

const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [{ title: 'Option 1' }, { title: 'Option 2' }],
};

const defaultModalConfigs = {

};

export function appReducer(reducer) {
	const initialState = {
		activeModals: {
			defaultSelector: null,
			defaultModal: null,
		},
		...reducer(undefined, { type: Actions.ReduxInit }),
	};

	return function (state = initialState, action) {
		switch (action.type) {
		case Actions.ToggleSelect:
			return handleToggleSelect(state, action);
		case Actions.ToggleModal:
			return handleToggleModal(state, action);
		case Actions.ToggleLoading:
			return handleToggleLoading(state, action);
		default:
			return reducer(state, action);
		}
	};
}

function handleToggleSelect(state, action) {
	const selectorName = action.id || 'default',
		selectorConfigs = {
			type: 'select',
			active: action.flag === true,
			configs: action.flag === true ? {
				...defaultSelectorConfigs,
				...action.configs
			} : state.activeModals[`${selectorName}Selector`].configs,
		};

	return {
		...state,
		activeModals: {
			...state.activeModals,
			[`${selectorName}Selector`]: selectorConfigs,
		},
	};
}

function handleToggleModal(state, action) {
	const activeModal = action.flag === false ? null : 'modal';

	return {
		...state,
		activeModal,
		modalConfigs: action.flag ? {
			...action.configs,
		} : state.modalConfigs,
	};
}

function handleToggleLoading(state, action) {
	const activeModal = action.flag === false
		? null : 'loading';

	return {
		...state,
		activeModal,
		loadingConfigs: action.flag ? {
			...action.configs,
		} : {},
	};
}