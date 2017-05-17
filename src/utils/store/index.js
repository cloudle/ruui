import * as actionsImport from './actions';
import * as appActionImport from './appAction';
import * as routeActionImport from './routeAction';

export const actions = actionsImport;
export const appAction = appActionImport;
export const routeAction = routeActionImport;

export * from './appReducer';
export * from './routeReducer';