import { RootState } from './store';

const getAuthToken = (state: RootState) => state.auth.token;

export const getAuthHeaderOrThrow = (state: RootState): HeadersInit => {
  const token = getAuthToken(state);
  if (token === null) {
    throw new Error('Token not loaded');
  }
  return { Authorization: `Bearer ${token}` };
};

export const getIsAuthTokenReady = (state: RootState): boolean => state.auth.token !== null;
