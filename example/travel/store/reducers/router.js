import { utils } from '../../../../src';
import { initialRoute } from '../../utils/routes';

const initialRouterState = {
	routes: [initialRoute],
};

export default utils.routeReducer(
	(state = initialRouterState, action) => {
		switch (action.type) {
			default:
				return state;
		}
	}
);