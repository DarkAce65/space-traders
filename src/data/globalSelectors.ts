import { RootState } from './store';

export const getAuthToken = (state: RootState) => state.auth.token;
