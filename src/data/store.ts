import { combineReducers, configureStore } from '@reduxjs/toolkit';

import localDataMiddleware from './localDataMiddleware';
import agent from './slices/agentSlice';
import auth from './slices/authSlice';
import localData from './slices/localDataSlice';
import ships from './slices/shipsSlice';
import universe from './slices/universeSlice';

const reducer = combineReducers({ agent, auth, localData, ships, universe });
export const createStore = () =>
  configureStore({
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(localDataMiddleware),
    reducer,
  });

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
