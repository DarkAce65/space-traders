import { createSlice } from '@reduxjs/toolkit';

export type AgentState = {
  accountId: string;
  agentName: string;
  headquarters: string;
  credits: number;
} | null;

const initialState = null as AgentState;

const agentSlice = createSlice({ name: 'agent', initialState, reducers: {} });

export default agentSlice.reducer;
