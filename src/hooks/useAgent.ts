import { useEffect } from 'react';

import { fetchAgent, getAgent, getAgentFetchStatus } from '../data/slices/agentSlice';
import { useAppDispatch, useAppSelector } from '../data/storeUtils';
import { Agent, DataAndLoadStatus } from '../types';

const useAgent = (): DataAndLoadStatus<Agent> => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(getAgentFetchStatus);
  const data = useAppSelector(getAgent);

  useEffect(() => {
    if (status === 'UNINITIALIZED' || status === 'FAILED') {
      dispatch(fetchAgent());
    }
  }, [dispatch, status]);

  if (status === 'UNINITIALIZED' || status === 'PENDING' || data === null) {
    return { status: 'LOADING', data: null };
  } else if (status === 'FAILED') {
    return { status: 'FAILED', data: null };
  }

  return { status: 'READY', data };
};

export default useAgent;
