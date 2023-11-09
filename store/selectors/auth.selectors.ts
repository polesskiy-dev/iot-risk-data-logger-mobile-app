import { RootState } from '../store';

export const isAuthenticatedSelector = (state: RootState): boolean =>
  Boolean(state.auth.session);
export const authErrorSelector = (state: RootState): string =>
  state.auth.error?.message || '';
export const isAuthLoadingStatusSelector = (state: RootState): boolean =>
  state.auth.loading === 'loading';
