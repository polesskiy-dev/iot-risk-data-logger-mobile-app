import { RootState } from '../store';

export const authSessionSelector = (state: RootState) => state.auth.session;

export const isAuthenticatedSelector = (state: RootState): boolean =>
  Boolean(authSessionSelector(state));
export const authErrorSelector = (state: RootState): string =>
  state.auth.error?.message || '';
export const isAuthLoadingStatusSelector = (state: RootState): boolean =>
  state.auth.loading === 'loading';
