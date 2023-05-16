import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import auth from './authSlice';

export const createStore = () => configureStore({ devTools: true, reducer: { auth } });

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState }>();
