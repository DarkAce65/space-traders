import { createSlice } from '@reduxjs/toolkit';

import { LoadStatus } from '../../types';
import { loadLocalData } from '../actions';

interface LocalDataState {
  localDataStatus: LoadStatus;
}

const initialState: LocalDataState = { localDataStatus: 'UNLOADED' };

const localDataSlice = createSlice({
  name: 'localData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalData.pending, (state) => {
        state.localDataStatus = 'LOADING';
      })
      .addCase(loadLocalData.fulfilled, (state) => {
        state.localDataStatus = 'LOADED';
      });
  },
});

export default localDataSlice.reducer;
