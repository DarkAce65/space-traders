import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agent from './slices/agentSlice';
import auth from './slices/authSlice';
import universe from './slices/universeSlice';

const reducer = combineReducers({ agent, auth, universe });
export const createStore = () => configureStore({ devTools: true, reducer });

export type RootState = ReturnType<typeof reducer>;
