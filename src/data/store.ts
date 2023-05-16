import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const createStore = () => configureStore({ devTools: true, reducer: {} });

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
