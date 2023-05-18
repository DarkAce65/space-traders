import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agent from './slices/agentSlice';
import auth from './slices/authSlice';
import ships from './slices/shipsSlice';
import universe from './slices/universeSlice';

const reducer = combineReducers({ agent, auth, ships, universe });
export const createStore = () => configureStore({ devTools: true, reducer });

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
