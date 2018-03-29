import { createStore } from '../utils/ruuiStore';
import appReducer from './appReducer';

const ruuiStore = createStore(appReducer);

export const reduxRuui = (store = ruuiStore) => {
	return reduxStore => next => (action) => {
		store.dispatch(action);
		next(action);
	};
};

export default ruuiStore;
global.ruuiStore = ruuiStore;