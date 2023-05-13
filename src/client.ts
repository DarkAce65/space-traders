import Bottleneck from 'bottleneck';
import createClient from 'openapi-fetch';

import { paths } from '@/schema';

const limiter = new Bottleneck({
  reservoir: 2,
  reservoirRefreshAmount: 2,
  reservoirRefreshInterval: 1000,
});

const baseClient = createClient<paths>({ baseUrl: 'https://api.spacetraders.io/v2' });
export const client = new Proxy(baseClient, {
  get(_, key: keyof typeof baseClient) {
    return limiter.wrap(baseClient[key]);
  },
});
