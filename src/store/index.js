import { createStore } from '../utils/ruuiStore';
import appReducer from './appReducer';

export const store = createStore(appReducer);

export const reduxRuuiMiddleware = (ruuiStore = store) => {
	return reduxStore => next => (action) => {
		store.dispatch(action);
		next(action);
	};
};

export default store;
global.ruuiStore = store;