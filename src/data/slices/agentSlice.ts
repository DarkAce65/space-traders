import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { registerAgent } from '../actions';
import { client, unwrapDataOrThrow } from '../client';
import { getAuthHeaderOrThrow } from '../selectors';
import { createAppAsyncThunk } from '../storeUtils';

export interface AgentState {
  accountId: string;
  agentName: string;
  headquarters: string;
  credits: number;
}

export const fetchAgent = createAppAsyncThunk('agent/fetch', async (_, { getState }) => {
  const headers = getAuthHeaderOrThrow(getState());
  const response = await client.get('/my/agent', { headers });
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
    builder.addMatcher(isAnyOf(registerAgent.fulfilled, fetchAgent.fulfilled), (state, action) => {
      let agent: external['../models/Agent.json'];
      if (registerAgent.fulfilled.match(action)) {
        agent = action.payload.data.agent;
      } else if (fetchAgent.fulfilled.match(action)) {
        agent = action.payload.data;
      } else {
        throw new Error('Unexpected action handled');
      }

      const { accountId, symbol, headquarters, credits } = agent;
      state.accountId = accountId;
      state.agentName = symbol;
      state.headquarters = headquarters;
      state.credits = credits;
    });
  },
});

export default agentSlice.reducer;
