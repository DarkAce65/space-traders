import { createSlice } from '@reduxjs/toolkit';

import { LoadStatus } from '../../types';
import { loadLocalData } from '../actions';

interface LocalDataState {
  localDataStatus: LoadStatus;
}

const initialState: LocalDataState = { localDataStatus: 'UNINITIALIZED' };

const localDataSlice = createSlice({
  name: 'localData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalData.pending, (state) => {
        state.localDataStatus = 'PENDING';
      })
      .addCase(loadLocalData.fulfilled, (state) => {
        state.localDataStatus = 'SUCCEEDED';
      })
      .addCase(loadLocalData.rejected, (state) => {
        state.localDataStatus = 'FAILED';
      });
  },
});

export default localDataSlice.reducer;
