import { paths } from '@/schema';

import { createAppAsyncThunk } from './storeUtils';
import { client, unwrapDataOrThrow } from '../client';

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
    client
      .post('/register', { body: { symbol: agentName, faction, email } })
      .then(unwrapDataOrThrow)
);
