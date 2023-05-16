import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { paths } from '@/schema';

import { RootState, createAppAsyncThunk } from './store';
import { client } from '../client';

interface AuthState {
  token: string | null;
}

export const getAuthToken = (state: RootState) => state.auth.token;

type RegisterAgentBody = NonNullable<
  paths['/register']['post']['requestBody']
>['content']['application/json'];
type RegisterAgentArgs = {
  agentName: RegisterAgentBody['symbol'];
  faction: RegisterAgentBody['faction'];
  email: RegisterAgentBody['email'];
};
export const registerAgent = createAppAsyncThunk(
  'auth/register',
  ({ agentName, faction, email }: RegisterAgentArgs) =>
    client.post('/register', { body: { symbol: agentName, faction, email } }).then((response) => {
      if (!response.data) {
        throw new Error(['Missing data', response.error].join(' '));
      }
      return response.data;
    })
);

const initialState: AuthState = { token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const { loadToken } = authSlice.actions;

export default authSlice.reducer;
