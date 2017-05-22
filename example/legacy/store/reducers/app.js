import * as Actions from '../actions';
import { appReducer } from '../../../../src';

const initialState = {
	counter: 0,
};

export default appReducer((state = initialState, action) => {
	switch (action.type) {
	case Actions.IncreaseCounter:
		return { ...state, counter: state.counter + action.volume };
	default:
		return state;
	}
});