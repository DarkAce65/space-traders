import { paths } from '@/schema';

import { createAppAsyncThunk } from './storeUtils';
import { client } from '../client';

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
