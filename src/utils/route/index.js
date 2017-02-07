import * as actionsImport from './actions';
import * as nativeActionImport from './nativeAction';

export let routerActions = actionsImport;
export let nativeRouteAction = nativeActionImport;

export * from './nativeReducer'; //utils.nativeRouteReducer