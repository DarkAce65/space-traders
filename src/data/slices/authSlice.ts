import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { registerAgent } from '../actions';

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: Cookies.get('agentToken') || null };

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
    builder.addCase(registerAgent.fulfilled, (state, action) => {
      state.token = action.payload.data.token;
      Cookies.set('agentToken', action.payload.data.token, { sameSite: 'strict', expires: 7 });
    });
  },
});

export const { loadToken } = authSlice.actions;

export default authSlice.reducer;
