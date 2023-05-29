import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { registerAgent } from '../actions';

export interface AuthState {
  isRegistering: boolean;
  token: string | null;
}

const initialState: AuthState = { isRegistering: false, token: Cookies.get('agentToken') || null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      Cookies.set('agentToken', action.payload, { sameSite: 'strict', expires: 7 });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAgent.pending, (state) => {
        state.isRegistering = true;
      })
      .addCase(registerAgent.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.token = action.payload.data.token;
        Cookies.set('agentToken', action.payload.data.token, { sameSite: 'strict', expires: 7 });
      })
      .addCase(registerAgent.rejected, (state) => {
        state.isRegistering = false;
      });
  },
});

export const { loadToken } = authSlice.actions;

export default authSlice.reducer;
