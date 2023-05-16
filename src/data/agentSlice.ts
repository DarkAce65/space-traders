import { createSlice } from '@reduxjs/toolkit';

import { getAuthToken } from './authSlice';
import { registerAgent } from './globalActions';
import { createAppAsyncThunk } from './storeUtils';
import { client, unwrapDataOrThrow } from '../client';

export interface AgentState {
  accountId: string;
  agentName: string;
  headquarters: string;
  credits: number;
}

export const fetchAgent = createAppAsyncThunk('agent/fetch', (_, { getState }) => {
  const token = getAuthToken(getState());
  return client
    .get('/my/agent', { headers: { Authorization: `Bearer ${token}` } })
    .then(unwrapDataOrThrow);
});

const initialState: AgentState = {
  accountId: '',
  agentName: '',
  headquarters: '',
  credits: 0,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerAgent.fulfilled, (state, action) => {
      const { accountId, symbol, headquarters, credits } = action.payload.data.agent;
      state.accountId = accountId;
      state.agentName = symbol;
      state.headquarters = headquarters;
      state.credits = credits;
    });
  },
});

export default agentSlice.reducer;
