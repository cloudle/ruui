import * as Actions from './actions';
import { collectionDestroy, collectionInsert, collectionMutate } from '../utils/collection';

const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [{ title: 'Option 1' }, { title: 'Option 2' }],
};

const initialState = {
	counter: 0,
	message: 'Hello, Stranger!',
	activeModals: {
		defaultSelector: null,
		defaultModal: null,
		loading: null,
	},
	activeDropdown: {
		active: false,
		configs: {
			tapToClose: true,
		},
	},
	tooltip: {
		active: false,
		configs: {}
	},
	snackBars: [],
	netInfo: {},
	dimensions: {},
};

export default function (state = initialState, action) {
	switch (action.type) {
	case '@APP:INCREASE-COUNTER':
		return { ...state, counter: state.counter + 1 };
	case '@APP:SET-MESSAGE':
		return { ...state, message: action.message };
	case Actions.ToggleSelect:
		return handleToggleSelect(state, action);
	case Actions.ToggleModal:
		return handleToggleModal(state, action);
	case Actions.ToggleDropdown:
		return handleToggleDropdown(state, action);
	case Actions.ToggleLoading:
		return handleToggleLoading(state, action);
	case Actions.ToggleTooltip:
		return handleToggleTooltip(state, action);
	case Actions.InsertSnackBar:
		return { ...state, snackBars: collectionInsert(state.snackBars, action.configs, true) };
	case Actions.StartDestroySnackBar:
		return { ...state, snackBars: collectionMutate(state.snackBars, {
			id: action.configs.id, destroying: true,
		}) };
	case Actions.DestroySnackBar:
		return { ...state, snackBars: collectionDestroy(state.snackBars, action.configs) };
	case Actions.UpdateDimensionInfo:
		return { ...state, dimensions: { ...state.dimensions, ...action.info } };
	case Actions.UpdateNetInfo:
		return { ...state, netInfo: { ...state.netInfo, ...action.info } };
	case Actions.ResetState:
		return { ...initialState, netInfo: state.netInfo, dimensions: state.dimensions };
	default:
		return state;
	}
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
		currentModal = state.activeModals[modalName] || {},
		modalConfigs = {
			type: 'modal',
			active: action.flag === true,
			configs: action.flag === true ? {
				...action.configs,
			} : currentModal.configs,
		};

	return {
		...state,
		activeModals: {
			...state.activeModals,
			[modalName]: modalConfigs,
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

function handleToggleDropdown(state, action) {
	return {
		...state,
		activeDropdown: {
			active: action.flag === true,
			configs: action.flag === true ? {
				...action.configs,
				tapToClose: action.configs.tapToClose || true,
			} : state.activeDropdown.configs,
		},
	};
}

function handleToggleTooltip(state, action) {
	return {
		...state,
		tooltip: {
			active: action.flag === true,
			configs: action.flag === true ? action.configs : state.tooltip.configs,
		},
	};
}