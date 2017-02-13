import * as Actions from '../actions';
import { utils } from '../../../../src';
import { localize } from '../../utils';

const initialState = {
  counter: 0,
	localize: localize('eng'),
};

export default utils.appReducer((state = initialState, action) => {
	switch (action.type) {
		case Actions.IncreaseCounter:
			return {...state, counter: state.counter + action.volume};
		case Actions.ChangeAppLocalize:
			return { ...state, localize: localize(action.lang) };
		default:
			return state;
	}
})