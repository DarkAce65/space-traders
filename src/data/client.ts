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

type RateLimitedClient = typeof baseClient & {
  getWithOptions: <P extends Parameters<typeof baseClient.get>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.get<P>>
  ) => ReturnType<typeof baseClient.get<P>>;
  putWithOptions: <P extends Parameters<typeof baseClient.put>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.put<P>>
  ) => ReturnType<typeof baseClient.put<P>>;
  postWithOptions: <P extends Parameters<typeof baseClient.post>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.post<P>>
  ) => ReturnType<typeof baseClient.post<P>>;
  delWithOptions: <P extends Parameters<typeof baseClient.del>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.del<P>>
  ) => ReturnType<typeof baseClient.del<P>>;
  optionsWithOptions: <P extends Parameters<typeof baseClient.options>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.options<P>>
  ) => ReturnType<typeof baseClient.options<P>>;
  headWithOptions: <P extends Parameters<typeof baseClient.head>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.head<P>>
  ) => ReturnType<typeof baseClient.head<P>>;
  patchWithOptions: <P extends Parameters<typeof baseClient.patch>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.patch<P>>
  ) => ReturnType<typeof baseClient.patch<P>>;
  traceWithOptions: <P extends Parameters<typeof baseClient.trace>[0]>(
    options: Bottleneck.JobOptions,
    ...args: Parameters<typeof baseClient.trace<P>>
  ) => ReturnType<typeof baseClient.trace<P>>;
};

export const client = {
  get: (...args) => limiter.schedule(() => baseClient.get(...args)),
  put: (...args) => limiter.schedule(() => baseClient.put(...args)),
  post: (...args) => limiter.schedule(() => baseClient.post(...args)),
  del: (...args) => limiter.schedule(() => baseClient.del(...args)),
  options: (...args) => limiter.schedule(() => baseClient.options(...args)),
  head: (...args) => limiter.schedule(() => baseClient.head(...args)),
  patch: (...args) => limiter.schedule(() => baseClient.patch(...args)),
  trace: (...args) => limiter.schedule(() => baseClient.trace(...args)),
  getWithOptions: (options, ...args) => limiter.schedule(options, () => baseClient.get(...args)),
  putWithOptions: (options, ...args) => limiter.schedule(options, () => baseClient.put(...args)),
  postWithOptions: (options, ...args) => limiter.schedule(options, () => baseClient.post(...args)),
  delWithOptions: (options, ...args) => limiter.schedule(options, () => baseClient.del(...args)),
  optionsWithOptions: (options, ...args) =>
    limiter.schedule(options, () => baseClient.options(...args)),
  headWithOptions: (options, ...args) => limiter.schedule(options, () => baseClient.head(...args)),
  patchWithOptions: (options, ...args) =>
    limiter.schedule(options, () => baseClient.patch(...args)),
  traceWithOptions: (options, ...args) =>
    limiter.schedule(options, () => baseClient.trace(...args)),
} satisfies RateLimitedClient;

export const unwrapDataOrThrow = <T>(response: FetchResponse<T>) => {
  if (!response.data) {
    throw new Error(['Missing data', response.error].join(' '));
  }
  return response.data;
};
