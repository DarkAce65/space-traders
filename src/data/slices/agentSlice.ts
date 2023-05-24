import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { external } from '@/schema';

import { LoadStatus } from '../../types';
import assertUnreachable from '../../utils/assertUnreachable';
import { registerAgent } from '../actions';
import { client, unwrapDataOrThrow } from '../client';
import { getAuthHeaderOrThrow } from '../selectors';
import { RootState } from '../store';
import { createAppAsyncThunk } from '../storeUtils';

export interface AgentState {
  registerAgentStatus: LoadStatus;
  status: LoadStatus;
  data: {
    accountId: string;
    agentName: string;
    headquarters: string;
    credits: number;
  } | null;
}

export const getAgentFetchStatus = (state: RootState) => state.agent.status;

export const getAgent = (state: RootState) => state.agent.data;

export const fetchAgent = createAppAsyncThunk(
  'agent/fetch',
  async (_, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    const response = await client.get('/my/agent', { headers });
    return unwrapDataOrThrow(response);
  },
  {
    condition: (_, { getState }) => {
      const fetchStatus = getAgentFetchStatus(getState());
      return fetchStatus === 'UNINITIALIZED' || fetchStatus === 'FAILED';
    },
  }
);

const initialState: AgentState = {
  registerAgentStatus: 'UNINITIALIZED',
  status: 'UNINITIALIZED',
  data: null,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addMatcher(isAnyOf(registerAgent.pending, fetchAgent.pending), (state, action) => {
        if (registerAgent.fulfilled.match(action)) {
          state.registerAgentStatus = 'PENDING';
        }
        state.status = 'PENDING';
      })
      .addMatcher(isAnyOf(registerAgent.fulfilled, fetchAgent.fulfilled), (state, action) => {
        let agent: external['../models/Agent.json'];
        if (registerAgent.fulfilled.match(action)) {
          agent = action.payload.data.agent;
          state.registerAgentStatus = 'SUCCEEDED';
        } else if (fetchAgent.fulfilled.match(action)) {
          agent = action.payload.data;
        } else {
          throw assertUnreachable(action);
        }

        state.status = 'SUCCEEDED';
        state.data = {
          accountId: agent.accountId,
          agentName: agent.symbol,
          headquarters: agent.headquarters,
          credits: agent.credits,
        };
      })
      .addMatcher(isAnyOf(registerAgent.rejected, fetchAgent.rejected), (state, action) => {
        if (registerAgent.fulfilled.match(action)) {
          state.registerAgentStatus = 'FAILED';
        }
        state.status = 'FAILED';
      });
  },
});

export default agentSlice.reducer;
