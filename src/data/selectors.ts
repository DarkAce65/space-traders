import { RootState } from './store';

export const getAuthTokenOrThrow = (state: RootState): string => {
  const { token } = state.auth;
  if (token === null) {
    throw new Error('Token not loaded');
  }
  return token;
};

export const getIsAuthTokenReady = (state: RootState): boolean => state.auth.token !== null;
