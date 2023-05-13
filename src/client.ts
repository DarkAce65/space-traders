import createClient from 'openapi-fetch';

import { paths } from '@/schema';

export const client = createClient<paths>({ baseUrl: 'https://api.spacetraders.io/v2' });
