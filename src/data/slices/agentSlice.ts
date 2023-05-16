import { createSlice } from '@reduxjs/toolkit';

import { client, unwrapDataOrThrow } from '../../client';
import { registerAgent } from '../actions';
import { getAuthToken } from '../selectors';
import { createAppAsyncThunk } from '../storeUtils';

export interface AgentState {
  accountId: string;
  agentName: string;
  headquarters: string;
  credits: number;
}

export const fetchAgent = createAppAsyncThunk('agent/fetch', async (_, { getState }) => {
  const token = getAuthToken(getState());
  const response = await client.get('/my/agent', { headers: { Authorization: `Bearer ${token}` } });
  return unwrapDataOrThrow(response);
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
