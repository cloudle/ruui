import * as Actions from './actions';

const defaultSelectorConfigs = {
	selectText: 'Select',
	cancelText: 'Cancel',
	options: [ {title: 'Option 1'}, {title: 'Option 2'} ],
};

export function appReducer (reducer: Reducer) {
	const initialState = {
		activeModal: null,
		selectorConfigs: defaultSelectorConfigs,
		...reducer(undefined, { type: Actions.ReduxInit })
	};

	return function (state = initialState, action) {
		switch (action.type) {
			case Actions.ToggleSelect:
				return handleToggleSelect(state, action);
			default:
				return reducer(state, action);
		}
	}
}

function handleToggleSelect (state, action) {
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