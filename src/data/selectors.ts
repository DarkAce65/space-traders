import { RootState } from './store';

export const getAuthToken = (state: RootState) => state.auth.token;

export const getAuthHeaderOrThrow = (state: RootState): HeadersInit => {
  const token = getAuthToken(state);
  if (token === null) {
    throw new Error('Token not loaded');
  }
  return { Authorization: `Bearer ${token}` };
};

export const getShouldLoadLocalData = (state: RootState) =>
  state.localData.localDataStatus === 'UNINITIALIZED' ||
  state.localData.localDataStatus === 'FAILED';
