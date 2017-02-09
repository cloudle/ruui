import { localize } from '../../utils';
import * as Actions from '../actions';

const initialState = {
  counter: 0,
	localize: localize('eng'),
};

export default function (state = initialState, action) {
	switch (action.type) {
		case Actions.IncreaseCounter:
			return {...state, counter: state.counter + action.volume};
		case Actions.ChangeAppLocalize:
			return { ...state, localize: localize(action.lang) };
		default:
			return state;
	}
}