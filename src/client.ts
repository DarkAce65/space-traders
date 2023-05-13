import Bottleneck from 'bottleneck';
import createClient from 'openapi-fetch';

import { paths } from '@/schema';

const client = createClient<paths>({ baseUrl: 'https://api.spacetraders.io/v2' });

const limiter = new Bottleneck({
  reservoir: 2,
  reservoirRefreshAmount: 2,
  reservoirRefreshInterval: 1000,
});

export const rateLimitedClient = new Proxy(client, {
  get(_, key: keyof typeof client) {
    return limiter.wrap(client[key]);
  },
});
