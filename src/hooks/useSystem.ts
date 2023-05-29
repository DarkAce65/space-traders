import { useCallback, useEffect } from 'react';

import { fetchSystem, getSystems } from '../data/slices/universeSlice';
import { useAppDispatch, useAppSelector } from '../data/storeUtils';
import { DataHookResponse, DehydratedSystem, LoadStatus, System } from '../types';

const useSystem = (systemSymbol: string): DataHookResponse<System | DehydratedSystem> => {
  const dispatch = useAppDispatch();

  const systems = useAppSelector(getSystems);
  const data = systems[systemSymbol] ? systems[systemSymbol].data : null;
  const status = useAppSelector((state): LoadStatus => {
    const systemStatus = state.universe.systemStatuses[systemSymbol];
    if (systemStatus) {
      return systemStatus;
    } else if (data !== null) {
      return 'SUCCEEDED';
    }
    return 'UNINITIALIZED';
  });

  const fetchData = useCallback(() => {
    dispatch(fetchSystem(systemSymbol));
  }, [dispatch, systemSymbol]);

  useEffect(() => {
    if (status === 'UNINITIALIZED') {
      fetchData();
    }
  }, [fetchData, status]);

  if (status === 'FAILED') {
    return { status: 'FAILED', data: null, refetch: fetchData };
  } else if (status === 'UNINITIALIZED' || status === 'PENDING' || data === null) {
    return { status: 'LOADING', data: null, refetch: fetchData };
  }

  return { status: 'READY', data, refetch: fetchData };
};

export default useSystem;
