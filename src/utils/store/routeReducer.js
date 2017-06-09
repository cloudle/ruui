import * as Actions from './actions';

type RouteAction = {
	key: string,
	params: Object,
};

type RouteOption = {
	component: any,
	params?: Object,
};

export function routeReducer(routeOptions: Object, reducer: Function) {
	const routeConfigs = buildOptions(routeOptions);

	const initialState = {
		index: 0,
		routes: [routeConfigs.Index],
		...reducer(undefined, { type: Actions.ReduxInit }),
	};

	return function (state = initialState, action) {
		switch (action.type) {
		case Actions.RouterPush:
			return handlePushRoute(state, action, false);
		case Actions.RouterReplace:
			return handlePushRoute(state, action, true);
		case Actions.RouterPop:
			return handlePopRoute(state, action);
		case Actions.RouterReset:
			return handleResetRoute(state, action);
		default:
			return reducer(state, action);
		}
	};

	function handlePushRoute(state, action: RouteAction, replace = false) {
		const nextRoute = routeConfigs[action.key],
			existedRouteIndex = state.routes.findIndex(route => route.key === action.key);

		if (nextRoute) {
			if (existedRouteIndex >= 0) {
				/* If existed route.. we'll just back to the history
				 * where the route was found (equal with GoTo..) */
				return {
					...state,
					routes: [
						...state.routes.slice(0, existedRouteIndex),
						{ ...nextRoute, params: action.params }
					],
					index: existedRouteIndex,
				};
			} else if (replace) {
				/* Replace the current (latest) route with nextRoute
				 * (use in case we want to go next route - but don't want user able go-back
				 * eg: registration form) */
				return {
					...state,
					routes: [
						...state.routes.slice(0, state.routes.length - 1),
						{ ...nextRoute, params: action.params }
					],
					index: state.routes.length - 1,
				};
			} else {
				/* Normal push, insert the new route as the last item.. */
				return {
					...state,
					routes: [
						...state.routes,
						{ ...nextRoute, params: action.params }
					],
					index: state.routes.length,
				};
			}
		} else {
			console.warn(`There is no route for: ${action.key}!, please check for typo or add the missing RouteOption..`);
			return state;
		}
	}

	function handlePopRoute(state, action: RouteAction) {
		if (state.routes.length >= 2) {
			const concreteRoutes = state.routes.slice(0, state.routes.length - 2),
				backingRoute = state.routes[state.routes.length - 2];

			/* Pop action allows user override their params if they want
			 * it actually merge new [params] with the current/old [params]  */
			return {
				...state,
				routes: [
					...concreteRoutes,
					{ ...backingRoute, params: { ...backingRoute.params, ...action.params } }
				],
				index: state.routes.length - 2,
			};
		} else {
			console.warn("There is route to go-back (pop), we're better stay there..");
			return state;
		}
	}

	function handleResetRoute(state, action: RouteOption) {
		const nextRoute = routeConfigs[action.key];

		if (nextRoute) {
			return {
				...state, index: 0, routes: [{
					...nextRoute, params: action.params,
				}],
			};
		} else {
			console.warn(`There is no route for: ${action.key}!, please check for typo or add the missing RouteOption..`);
			return state;
		}
	}
}

function buildOptions(routeOptions: Object) {
	return Object.keys(routeOptions).reduce((accumulate, nextKey, index) => {
		/* Check for routeOptions for Index route, if it wasn't exist.. pick the first route as Index */

		const result = {
			...accumulate,
			[nextKey]: { ...routeOptions[nextKey], key: nextKey, },
		};

		if (index === 0) {
			const indexRoute = routeOptions.index || routeOptions.Index || routeOptions[nextKey];
			result.Index = { ...indexRoute, key: 'Index', };
		}

		return result;
	}, {});
}