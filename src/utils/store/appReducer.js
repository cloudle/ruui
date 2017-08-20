import * as Actions from './actions';
import { collectionInsert, collectionDestroy, collectionMutate } from '../collection';

const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [{ title: 'Option 1' }, { title: 'Option 2' }],
};

export function initialAppState(initialState = {}, previousState = {}) {
	return {
		activeModals: {
			defaultSelector: null,
			defaultModal: null,
			loading: null,
		},
		snackBars: [],
		themeConfigs: previousState.themeConfigs || {},
		netInfo: previousState.netInfo || {},
		screenInfo: previousState.screenInfo || {},
		...initialState,
	};
}

export function appReducer(reducer) {
	const initialState = initialAppState(reducer(undefined, { type: Actions.ReduxInit }));

	return function (state = initialState, action) {
		switch (action.type) {
		case Actions.ToggleSelect:
			return handleToggleSelect(state, action);
		case Actions.ToggleModal:
			return handleToggleModal(state, action);
		case Actions.ToggleLoading:
			return handleToggleLoading(state, action);
		case Actions.InsertSnackBar:
			return { ...state, snackBars: collectionInsert(state.snackBars, action.configs, true) };
		case Actions.StartDestroySnackBar:
			return { ...state, snackBars: collectionMutate(state.snackBars, {
				id: action.configs.id, destroying: true,
			}) };
		case Actions.DestroySnackBar:
			return { ...state, snackBars: collectionDestroy(state.snackBars, action.configs) };
		case Actions.UpdateThemeConfigs:
			return { ...state, themeConfigs: { ...state.themeConfigs, ...action.configs } };
		case Actions.UpdateScreenInfo:
			return { ...state, screenInfo: { ...state.screenInfo, ...action.info } };
		case Actions.UpdateNetInfo:
			return { ...state, netInfo: { ...state.netInfo, ...action.info } };
		case Actions.ResetState:
			return initialAppState(reducer(undefined, { type: Actions.ReduxInit }), state);
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