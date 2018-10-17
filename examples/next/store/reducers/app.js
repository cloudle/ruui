import * as Actions from '../actions';

const initialState = {
	counter: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
	case Actions.IncreaseCounter:
		return { ...state, counter: state.counter + action.volume };
	default:
		return state;
	}
};