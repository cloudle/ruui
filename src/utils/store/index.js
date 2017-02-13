import * as actionsImport from './actions';
import * as nativeActionImport from './nativeAction';
import * as browserActionImport from './browserAction';

export let routerActions = actionsImport;
export let nativeRouteAction = nativeActionImport;
export let browserRouteAction = browserActionImport;

export * from './appReducer'; //utils.appReducer
export * from './nativeReducer'; //utils.nativeRouteReducer
export * from './browserReducer'; //utils.browserReducer