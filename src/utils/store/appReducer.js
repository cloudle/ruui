import * as Actions from './actions';

export function appReducer (reducer: Reducer) {
	const initialState = {
		activeModal: 'select',
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
	console.log(state, action);
	const activeModal = action.flag == false
		? null : action.flag == true
			? 'select'
			: state.activeModal == null ? 'select' : null;

	return { ...state, activeModal };
}