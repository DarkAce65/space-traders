import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agent from './slices/agentSlice';
import auth from './slices/authSlice';

const reducer = combineReducers({ agent, auth });
export const createStore = () => configureStore({ devTools: true, reducer });

export type RootState = ReturnType<typeof reducer>;
