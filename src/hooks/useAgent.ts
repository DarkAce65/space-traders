import { useCallback, useEffect } from 'react';

import { fetchAgent, getAgent, getAgentFetchStatus } from '../data/slices/agentSlice';
import { useAppDispatch, useAppSelector } from '../data/storeUtils';
import { Agent, DataHookResponse } from '../types';

const useAgent = (): DataHookResponse<Agent> => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(getAgentFetchStatus);
  const data = useAppSelector(getAgent);

  const fetchData = useCallback(() => {
    dispatch(fetchAgent());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'UNINITIALIZED') {
      fetchData();
    }
  }, [fetchData, status]);

  if (status === 'UNINITIALIZED' || status === 'PENDING' || data === null) {
    return { status: 'LOADING', data: null, refetch: fetchData };
  } else if (status === 'FAILED') {
    return { status: 'FAILED', data: null, refetch: fetchData };
  }

  return { status: 'READY', data, refetch: fetchData };
};

export default useAgent;
