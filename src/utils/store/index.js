import * as actionsImport from './actions';
import * as appActionImport from './appAction';
import * as nativeActionImport from './nativeAction';

export let routerActions = actionsImport;
export let appAction = appActionImport;
export let nativeRouteAction = nativeActionImport;

export * from './appReducer'; //utils.appReducer
export * from './nativeReducer'; //utils.nativeRouterReducer