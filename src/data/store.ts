import { combineReducers, configureStore } from '@reduxjs/toolkit';

import auth from './authSlice';

const reducer = combineReducers({ auth });
export const createStore = () => configureStore({ devTools: true, reducer });

export type RootState = ReturnType<typeof reducer>;
