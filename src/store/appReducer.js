import * as Actions from './actions';
import { collectionDestroy, collectionInsert, collectionMutate, maxBy, } from '../utils';

const initialSize = { width: 0, height: 0, };
const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [{ title: 'Option 1' }, { title: 'Option 2' }],
};

export const initialState = {
	counter: 0,
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
	dimensions: { screen: initialSize, window: initialSize },
};

export default function (state = initialState, action) {
	switch (action.type) {
	case '@APP:INCREASE-COUNTER':
		return { ...state, counter: state.counter + 1 };
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
	const selectorName = action.configs.id || 'default';
	const isToggleOn = action.flag === true;
	const layerProp = extractLayerDepthProp(state.activeModals, isToggleOn);
	const selectorConfigs = {
		type: 'select',
		active: action.flag === true,
		configs: action.flag === true ? {
			...defaultSelectorConfigs,
			...layerProp,
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
	const modalName = action.configs.id || 'default';
	const currentModal = state.activeModals[modalName] || {};
	const isToggleOn = action.flag === true;
	const layerProp = extractLayerDepthProp(state.activeModals, isToggleOn);
	const modalConfigs = {
		type: 'modal',
		active: isToggleOn,
		configs: action.flag === true ? {
			...layerProp,
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
					zIndex: 9999,
					...action.configs,
				} : {},
			} : null,
		},
	};
}

function handleToggleDropdown(state, action) {
	const dropdownName = action.configs.id || 'default_dropdown';
	const currentDropdown = state.activeModals[dropdownName] || {},
		isToggleOn = action.flag === true;
	if (!isToggleOn) {
		const newState = { ...state };
		delete newState.activeModals[dropdownName];
		return newState;
	}
	const layerProp = extractLayerDepthProp(state.activeModals, isToggleOn);
	const dropdownConfigs = {
		type: 'dropdown',
		active: isToggleOn,
		configs: action.flag === true ? {
			...layerProp,
			...action.configs,
		} : currentDropdown.configs,
	};
	dropdownConfigs.configs.tapToClose = true;

	return {
		...state,
		activeModals: {
			...state.activeModals,
			[dropdownName]: dropdownConfigs,
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

function suggestLayerDepth(modalMap) {
	const modalArray = Object.values(modalMap);
	const extractIndex = item => item && item.configs && item.configs.zIndex;
	const indexArray = modalArray.map(extractIndex).filter(item => item >= 0 && item < 9000);
	return maxBy(indexArray) + 1;
}

function extractLayerDepthProp(modalMap, isToggleOn) {
	const nextLayerDepth = suggestLayerDepth(modalMap);
	return isToggleOn ? { zIndex: Number.isNaN(nextLayerDepth) ? 0 : nextLayerDepth } : {};
}
