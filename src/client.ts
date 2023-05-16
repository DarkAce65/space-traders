import Bottleneck from 'bottleneck';
import createClient, { FetchResponse } from 'openapi-fetch';

import { paths } from '@/schema';

const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 500,

  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 10_000,
});

const baseClient = createClient<paths>({ baseUrl: 'https://api.spacetraders.io/v2' });
export const client = new Proxy(baseClient, {
  get(_, key: keyof typeof baseClient) {
    return limiter.wrap(baseClient[key]);
  },
});

export const unwrapDataOrThrow = <T>(response: FetchResponse<T>) => {
  if (!response.data) {
    throw new Error(['Missing data', response.error].join(' '));
  }
  return response.data;
};
