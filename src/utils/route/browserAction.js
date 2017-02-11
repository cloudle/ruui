import * as Actions from './actions';

export function push (path) {
	return {
		type: Actions.BrowserRouterNavigate,
		location: { pathname: path },
		action: 'PUSH',
	}
}