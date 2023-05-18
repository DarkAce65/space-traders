import { createAsyncThunk } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState }>();
