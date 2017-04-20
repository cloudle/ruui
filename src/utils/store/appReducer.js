import * as Actions from './actions';

const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [{ title: 'Option 1' }, { title: 'Option 2' }],
};

export function appReducer(reducer: Reducer) {
	const initialState = {
		activeModal: null,
		selectorConfigs: defaultSelectorConfigs,
		modalConfigs: {},
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
	const activeModal = action.flag === false
		? null : action.flag === true
			? 'select'
			: state.activeModal === null ? 'select' : null;

	return {
		...state,
		activeModal,
		selectorConfigs: action.flag ? {
			...defaultSelectorConfigs,
			...action.configs,
		} : state.selectorConfigs,
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