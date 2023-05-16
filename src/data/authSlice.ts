import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { registerAgent } from './globalActions';

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAgent.fulfilled, (state, action) => {
      state.token = action.payload.data.token;
    });
  },
});

export const { loadToken } = authSlice.actions;

export default authSlice.reducer;
