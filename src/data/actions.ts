import { paths } from '@/schema';

import { client, unwrapDataOrThrow } from './client';
import { readSystemsAndWaypoints } from './localDb';
import { getAuthHeaderOrThrow, getShouldLoadLocalData } from './selectors';
import { createAppAsyncThunk } from './storeUtils';

export const loadLocalData = createAppAsyncThunk('loadLocalData', () => readSystemsAndWaypoints(), {
  condition: (_, { getState }) => getShouldLoadLocalData(getState()),
});

type RegisterAgentBody = NonNullable<
  paths['/register']['post']['requestBody']
>['content']['application/json'];
export type RegisterAgentArgs = {
  agentName: RegisterAgentBody['symbol'];
  faction: RegisterAgentBody['faction'];
  email?: RegisterAgentBody['email'];
};
export const registerAgent = createAppAsyncThunk(
  'auth/register',
  ({ agentName, faction, email }: RegisterAgentArgs) =>
    client
      .post('/register', { body: { symbol: agentName, faction, email } })
      .then(unwrapDataOrThrow),
  {
    condition: (_, { getState }) => getState().auth.isRegistering,
  }
);

export const scanSystems = createAppAsyncThunk(
  'ships/scanSystems',
  (shipSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    return client
      .post('/my/ships/{shipSymbol}/scan/systems', { headers, params: { path: { shipSymbol } } })
      .then(unwrapDataOrThrow);
  }
);

export const scanWaypoints = createAppAsyncThunk(
  'ships/scanWaypoints',
  (shipSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    return client
      .post('/my/ships/{shipSymbol}/scan/waypoints', { headers, params: { path: { shipSymbol } } })
      .then(unwrapDataOrThrow);
  }
);

export const scanShips = createAppAsyncThunk(
  'ships/scanShips',
  (shipSymbol: string, { getState }) => {
    const headers = getAuthHeaderOrThrow(getState());
    return client
      .post('/my/ships/{shipSymbol}/scan/ships', { headers, params: { path: { shipSymbol } } })
      .then(unwrapDataOrThrow);
  }
);
