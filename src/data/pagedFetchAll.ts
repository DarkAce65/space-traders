export const pagedFetchAll = async <R>(
  fetcher: (page: number, limit: number) => Promise<{ data: R[]; total: number }>,
  pageSize: number
): Promise<{ data: R[]; total: number }> => {
  const { data: firstPageData, total } = await fetcher(1, pageSize);
  const numPages = Math.ceil(total / pageSize);

  const requests: ReturnType<typeof fetcher>[] = [];
  for (let i = 2; i <= numPages; i++) {
    requests.push(fetcher(i, pageSize));
  }

  const remainingPages = await Promise.all(requests);
  const data = [...firstPageData, ...remainingPages.flatMap((page) => page.data)];

  return { data, total };
};
