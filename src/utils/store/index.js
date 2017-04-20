import * as actionsImport from './actions';
import * as appActionImport from './appAction';
import * as nativeActionImport from './nativeAction';

export const routerActions = actionsImport;
export const appAction = appActionImport;
export const nativeRouteAction = nativeActionImport;

export * from './appReducer';
export * from './nativeReducer';