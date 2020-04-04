import React from 'react';

import appReducer from '../store/appReducer';
import { createStore } from './ruuiStore';

export const ruuiStore = createStore(appReducer);
export const RuuiContext = React.createContext(ruuiStore);
