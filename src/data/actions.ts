import { paths } from '@/schema';

import { createAppAsyncThunk } from './storeUtils';
import { client, unwrapDataOrThrow } from '../client';

type RegisterAgentBody = NonNullable<
  paths['/register']['post']['requestBody']
>['content']['application/json'];
type RegisterAgentArgs = {
  agentName: RegisterAgentBody['symbol'];
  faction: RegisterAgentBody['faction'];
  email?: RegisterAgentBody['email'];
};
export const registerAgent = createAppAsyncThunk(
  'auth/register',
  ({ agentName, faction, email }: RegisterAgentArgs) =>
    client
      .post('/register', { body: { symbol: agentName, faction, email } })
      .then(unwrapDataOrThrow)
);

export const scanSystems = createAppAsyncThunk('ships/scanSystems', (shipSymbol: string) =>
  client
    .post('/my/ships/{shipSymbol}/scan/systems', { params: { path: { shipSymbol } } })
    .then(unwrapDataOrThrow)
);

export const scanWaypoints = createAppAsyncThunk('ships/scanWaypoints', (shipSymbol: string) =>
  client
    .post('/my/ships/{shipSymbol}/scan/waypoints', { params: { path: { shipSymbol } } })
    .then(unwrapDataOrThrow)
);

export const scanShips = createAppAsyncThunk('ships/scanShips', (shipSymbol: string) =>
  client
    .post('/my/ships/{shipSymbol}/scan/ships', { params: { path: { shipSymbol } } })
    .then(unwrapDataOrThrow)
);
