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
			loading: null,
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
	const selectorName = action.configs.id || 'default',
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
	const modalName = action.configs.id || 'default',
		modalConfigs = {
			type: 'modal',
			active: action.flag === true,
			configs: action.flag === true ? {
				...action.configs,
			} : state.activeModals[`${modalName}Modal`].configs,
		};

	return {
		...state,
		activeModals: {
			...state.activeModals,
			[`${modalName}Modal`]: modalConfigs,
		},
	};
}

function handleToggleLoading(state, action) {
	return {
		...state,
		activeModals: {
			...state.activeModals,
			loading: action.flag === true ? {
				type: 'loading',
				active: action.flag === true,
				configs: action.flag ? {
					...action.configs,
				} : {},
			} : null,
		},
	};
}