import * as actionsImport from './actions';
import * as appActionImport from './appAction';
import * as nativeActionImport from './nativeAction';
import * as browserActionImport from './browserAction';

export let routerActions = actionsImport;
export let appAction = appActionImport;
export let nativeRouteAction = nativeActionImport;
export let browserRouteAction = browserActionImport;

export * from './appReducer'; //utils.appReducer
export * from './nativeReducer'; //utils.nativeRouteReducer
export * from './browserReducer'; //utils.browserReducer