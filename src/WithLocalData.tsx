import { PropsWithChildren, useEffect } from 'react';

import Spinner from './Spinner';
import { loadLocalData } from './data/actions';
import { getLocalDataStatus } from './data/slices/localDataSlice';
import { useAppDispatch, useAppSelector } from './data/storeUtils';

const WithLocalData = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(getLocalDataStatus);

  useEffect(() => {
    dispatch(loadLocalData());
  }, [dispatch]);

  if (status === 'UNINITIALIZED' || status === 'PENDING') {
    return <Spinner />;
  } else if (status === 'FAILED') {
    return <div>ERROR</div>;
  }

  return <div>{children}</div>;
};

export default WithLocalData;
