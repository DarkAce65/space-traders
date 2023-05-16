import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agent from './agentSlice';
import auth from './authSlice';

const reducer = combineReducers({ agent, auth });
export const createStore = () => configureStore({ devTools: true, reducer });

export type RootState = ReturnType<typeof reducer>;
